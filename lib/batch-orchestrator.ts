import { BatchConfig, BatchState, BatchJob, createBatchState } from './batch'

export interface BatchOrchestratorEvents {
  onJobStart?: (job: BatchJob) => void
  onJobComplete?: (job: BatchJob, runId: string) => void
  onJobFail?: (job: BatchJob, error: string) => void
  onJobRetry?: (job: BatchJob, delayMs: number) => void
  onBatchComplete?: (state: BatchState) => void
  onBatchFail?: (state: BatchState) => void
}

function calculateBackoffDelay(retryCount: number, baseDelayMs: number = 1000): number {
  return Math.min(baseDelayMs * Math.pow(2, retryCount), 30000)
}

export class BatchOrchestrator {
  private state: BatchState
  private events: BatchOrchestratorEvents
  private isRunning: boolean = false
  private abortController: AbortController | null = null

  constructor(config: BatchConfig, events: BatchOrchestratorEvents = {}) {
    this.state = createBatchState(config)
    this.events = events
  }

  getState(): BatchState {
    return this.state
  }

  async executeJob(gameSlug: string, modelId: string): Promise<string> {
    const runId = `${modelId.toLowerCase()}__${new Date().toISOString().split('T')[0]}__automated`
    await new Promise(resolve => setTimeout(resolve, 100))
    return runId
  }

  async run(): Promise<void> {
    if (this.isRunning) return
    this.isRunning = true
    this.abortController = new AbortController()

    const jobs = this.state.getAllJobs()
    const maxConcurrency = this.state.config.max_concurrency
    let activeCount = 0
    let jobIndex = 0

    const runJob = async (job: BatchJob) => {
      if (this.abortController?.signal.aborted) return

      this.state.startJob(job.id)
      this.events.onJobStart?.(job)

      try {
        const runId = await this.executeJob(job.game_slug, job.model_id)
        this.state.completeJob(job.id, runId)
        this.events.onJobComplete?.(job, runId)
      } catch (err: any) {
        this.state.failJob(job.id, err.message || 'Unknown error')
        this.events.onJobFail?.(job, err.message || 'Unknown error')

        if (this.state.retryJob(job.id)) {
          const job_obj = this.state.getJob(job.id)
          if (job_obj) {
            const delay = calculateBackoffDelay(job_obj.retry_count)
            this.events.onJobRetry?.(job, delay)
          }
        }
      }
    }

    const processNext = async (): Promise<void> => {
      while (jobIndex < jobs.length && activeCount < maxConcurrency) {
        if (this.abortController?.signal.aborted) break

        const job = jobs[jobIndex++]
        activeCount++
        runJob(job).finally(() => {
          activeCount--
          processNext()
        })
      }
    }

    await new Promise<void>((resolve) => {
      const checkComplete = setInterval(() => {
        if (this.state.isComplete() || this.abortController?.signal.aborted) {
          clearInterval(checkComplete)
          resolve()
        }
      }, 100)
    })

    this.isRunning = false

    if (this.state.getProgress().failed > 0) {
      this.events.onBatchFail?.(this.state)
    } else {
      this.events.onBatchComplete?.(this.state)
    }
  }

  cancel(): void {
    this.abortController?.abort()
    this.isRunning = false
  }
}

export async function runBatch(
  config: BatchConfig,
  executeFn: (gameSlug: string, modelId: string) => Promise<string>,
  events: BatchOrchestratorEvents = {}
): Promise<BatchState> {
  const state = createBatchState(config)

  for (const game of config.games) {
    for (const model of config.models) {
      state.addJob(game, model)
    }
  }

  const maxConcurrency = config.max_concurrency
  const allJobs = state.getAllJobs()
  let activeCount = 0
  let jobIndex = 0
  let completedCount = 0

  return new Promise((resolve) => {
    const runJob = async (job: BatchJob) => {
      state.startJob(job.id)
      events.onJobStart?.(job)

      try {
        const runId = await executeFn(job.game_slug, job.model_id)
        state.completeJob(job.id, runId)
        events.onJobComplete?.(job, runId)
      } catch (err: any) {
        state.failJob(job.id, err.message || 'Unknown error')
        events.onJobFail?.(job, err.message || 'Unknown error')

        if (state.retryJob(job.id)) {
          const job_obj = state.getJob(job.id)
          if (job_obj) {
            const delay = calculateBackoffDelay(job_obj.retry_count)
            events.onJobRetry?.(job, delay)
          }
        }
      }

      completedCount++
      if (completedCount === allJobs.length) {
        resolve(state)
      }
    }

    const processNext = () => {
      while (jobIndex < allJobs.length && activeCount < maxConcurrency) {
        const job = allJobs[jobIndex++]
        activeCount++
        runJob(job).finally(() => {
          activeCount--
          processNext()
        })
      }
    }

    processNext()

    const checkComplete = setInterval(() => {
      if (completedCount === allJobs.length) {
        clearInterval(checkComplete)
      }
    }, 100)
  })
}