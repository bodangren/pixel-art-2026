export type AlertType = 'regression' | 'failure' | 'completion'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type TransportType = 'webhook' | 'email'

export interface AlertCondition {
  type: AlertType
  threshold?: number
}

export interface AlertAction {
  type: TransportType
  url?: string
  to?: string
  subject?: string
  retryCount?: number
}

export interface AlertConfig {
  regressionThreshold?: number
  minAverageScore?: number
  enabled?: boolean
}

export interface Alert {
  id: string
  run_id: string
  model_id: string
  type: AlertType
  severity: AlertSeverity
  message: string
  created_at: string
  metadata?: Record<string, unknown>
}

interface RunScore {
  run_id: string
  model_id: string
  average_human_score: number
  run_date: string
}

interface RunStatus {
  run_id: string
  model_id: string
  status: 'pending' | 'completed' | 'failed'
  run_date: string
}

export class AlertRulesEngine {
  private config: Required<AlertConfig>

  constructor(config: AlertConfig = {}) {
    this.config = {
      regressionThreshold: config.regressionThreshold ?? 0.05,
      minAverageScore: config.minAverageScore ?? 0,
      enabled: config.enabled ?? true
    }
  }

  detectRegression(runs: RunScore[]): Alert[] {
    if (!this.config.enabled) return []

    const alerts: Alert[] = []
    const modelRuns = new Map<string, RunScore[]>()

    for (const run of runs) {
      if (!modelRuns.has(run.model_id)) {
        modelRuns.set(run.model_id, [])
      }
      modelRuns.get(run.model_id)!.push(run)
    }

    for (const [modelId, modelRunList] of modelRuns) {
      const sorted = [...modelRunList].sort(
        (a, b) => new Date(a.run_date).getTime() - new Date(b.run_date).getTime()
      )

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]
        const curr = sorted[i]
        const drop = (prev.average_human_score - curr.average_human_score) / prev.average_human_score

        if (drop > this.config.regressionThreshold) {
          alerts.push({
            id: `reg-${prev.run_id}-${curr.run_id}`,
            run_id: curr.run_id,
            model_id: modelId,
            type: 'regression',
            severity: drop > 0.10 ? 'critical' : 'high',
            message: `Score dropped ${(drop * 100).toFixed(1)}% for ${modelId} (${prev.average_human_score} → ${curr.average_human_score})`,
            created_at: new Date().toISOString(),
            metadata: {
              previousScore: prev.average_human_score,
              currentScore: curr.average_human_score,
              dropPercent: drop * 100
            }
          })
        }
      }
    }

    return alerts
  }

  detectFailures(runs: RunStatus[]): Alert[] {
    if (!this.config.enabled) return []

    return runs
      .filter(run => run.status === 'failed')
      .map(run => ({
        id: `fail-${run.run_id}`,
        run_id: run.run_id,
        model_id: run.model_id,
        type: 'failure' as AlertType,
        severity: 'critical' as AlertSeverity,
        message: `Run ${run.run_id} for ${run.model_id} failed`,
        created_at: new Date().toISOString()
      }))
  }

  detectCompletion(runs: RunStatus[], knownCompleted: Set<string>): Alert[] {
    if (!this.config.enabled) return []

    return runs
      .filter(run => run.status === 'completed' && !knownCompleted.has(run.run_id))
      .map(run => ({
        id: `comp-${run.run_id}`,
        run_id: run.run_id,
        model_id: run.model_id,
        type: 'completion' as AlertType,
        severity: 'low' as AlertSeverity,
        message: `Run ${run.run_id} for ${run.model_id} completed successfully`,
        created_at: new Date().toISOString()
      }))
  }

  evaluateConditions(run: RunScore): boolean {
    if (!this.config.enabled) return false
    if (run.average_human_score < this.config.minAverageScore) return true
    return false
  }
}