import { describe, it, expect } from 'vitest'
import { AlertRulesEngine, type AlertCondition, type AlertAction } from './alert-rules'

describe('AlertRulesEngine', () => {
  describe('regression detection', () => {
    it('detects score drop exceeding threshold between consecutive runs', () => {
      const engine = new AlertRulesEngine({
        regressionThreshold: 0.05
      })
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 4.0, run_date: '2026-05-01' },
        { run_id: 'r2', model_id: 'gpt-4o', average_human_score: 3.7, run_date: '2026-05-02' }
      ]
      const alerts = engine.detectRegression(runs)
      expect(alerts).toHaveLength(1)
      expect(alerts[0].type).toBe('regression')
      expect(alerts[0].severity).toBe('high')
    })

    it('no alert when drop is within threshold', () => {
      const engine = new AlertRulesEngine({
        regressionThreshold: 0.10
      })
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 4.0, run_date: '2026-05-01' },
        { run_id: 'r2', model_id: 'gpt-4o', average_human_score: 3.96, run_date: '2026-05-02' }
      ]
      const alerts = engine.detectRegression(runs)
      expect(alerts).toHaveLength(0)
    })

    it('no regression alert for first run of model', () => {
      const engine = new AlertRulesEngine({
        regressionThreshold: 0.05
      })
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 4.0, run_date: '2026-05-01' }
      ]
      const alerts = engine.detectRegression(runs)
      expect(alerts).toHaveLength(0)
    })

    it('detects regression within same model across multiple runs', () => {
      const engine = new AlertRulesEngine({
        regressionThreshold: 0.05
      })
      const runs = [
        { run_id: 'r1', model_id: 'claude-3.5', average_human_score: 4.5, run_date: '2026-04-28' },
        { run_id: 'r2', model_id: 'claude-3.5', average_human_score: 4.0, run_date: '2026-04-29' },
        { run_id: 'r3', model_id: 'claude-3.5', average_human_score: 3.4, run_date: '2026-04-30' }
      ]
      const alerts = engine.detectRegression(runs)
      expect(alerts).toHaveLength(2)
      expect(alerts.every(a => a.type === 'regression')).toBe(true)
    })
  })

  describe('run failure detection', () => {
    it('detects failed run', () => {
      const engine = new AlertRulesEngine({})
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', status: 'failed' as const, run_date: '2026-05-01' }
      ]
      const alerts = engine.detectFailures(runs)
      expect(alerts).toHaveLength(1)
      expect(alerts[0].type).toBe('failure')
      expect(alerts[0].severity).toBe('critical')
    })

    it('no alert for completed run', () => {
      const engine = new AlertRulesEngine({})
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', status: 'completed' as const, run_date: '2026-05-01' }
      ]
      const alerts = engine.detectFailures(runs)
      expect(alerts).toHaveLength(0)
    })

    it('detects multiple failures across models', () => {
      const engine = new AlertRulesEngine({})
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', status: 'failed' as const, run_date: '2026-05-01' },
        { run_id: 'r2', model_id: 'claude-3.5', status: 'failed' as const, run_date: '2026-05-01' }
      ]
      const alerts = engine.detectFailures(runs)
      expect(alerts).toHaveLength(2)
    })

    it('ignores pending runs', () => {
      const engine = new AlertRulesEngine({})
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', status: 'pending' as const, run_date: '2026-05-01' }
      ]
      const alerts = engine.detectFailures(runs)
      expect(alerts).toHaveLength(0)
    })
  })

  describe('run completion detection', () => {
    it('detects newly completed run', () => {
      const engine = new AlertRulesEngine({})
      const completedRunIds = new Set(['r1'])
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', status: 'completed' as const, run_date: '2026-05-01' },
        { run_id: 'r2', model_id: 'claude-3.5', status: 'completed' as const, run_date: '2026-05-02' }
      ]
      const alerts = engine.detectCompletion(runs, completedRunIds)
      expect(alerts).toHaveLength(1)
      expect(alerts[0].type).toBe('completion')
      expect(alerts[0].run_id).toBe('r2')
    })

    it('no alert when run already known completed', () => {
      const engine = new AlertRulesEngine({})
      const completedRunIds = new Set(['r1', 'r2'])
      const runs = [
        { run_id: 'r1', model_id: 'gpt-4o', status: 'completed' as const, run_date: '2026-05-01' },
        { run_id: 'r2', model_id: 'claude-3.5', status: 'completed' as const, run_date: '2026-05-02' }
      ]
      const alerts = engine.detectCompletion(runs, completedRunIds)
      expect(alerts).toHaveLength(0)
    })
  })

  describe('evaluate conditions', () => {
    it('returns true when score is below minimum', () => {
      const engine = new AlertRulesEngine({
        minAverageScore: 3.0
      })
      const run = { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 2.5, run_date: '2026-05-01' }
      expect(engine.evaluateConditions(run)).toBe(true)
    })

    it('returns false when score meets minimum', () => {
      const engine = new AlertRulesEngine({
        minAverageScore: 3.0
      })
      const run = { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 3.5, run_date: '2026-05-01' }
      expect(engine.evaluateConditions(run)).toBe(false)
    })

    it('respects enabled flag', () => {
      const engine = new AlertRulesEngine({
        minAverageScore: 3.0,
        enabled: false
      })
      const run = { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 2.5, run_date: '2026-05-01' }
      expect(engine.evaluateConditions(run)).toBe(false)
    })
  })
})

describe('AlertCondition', () => {
  it('serializes to JSON correctly', () => {
    const condition: AlertCondition = {
      type: 'regression',
      threshold: 0.05
    }
    const json = JSON.stringify(condition)
    const parsed = JSON.parse(json)
    expect(parsed.type).toBe('regression')
    expect(parsed.threshold).toBe(0.05)
  })
})

describe('AlertAction', () => {
  it('creates webhook action', () => {
    const action: AlertAction = {
      type: 'webhook',
      url: 'https://example.com/webhook',
      retryCount: 3
    }
    expect(action.type).toBe('webhook')
    expect(action.url).toBe('https://example.com/webhook')
    expect(action.retryCount).toBe(3)
  })

  it('creates email action', () => {
    const action: AlertAction = {
      type: 'email',
      to: 'admin@example.com',
      subject: 'Benchmark Alert'
    }
    expect(action.type).toBe('email')
    expect(action.to).toBe('admin@example.com')
  })
})