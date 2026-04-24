import { z } from 'zod'
import { StyleCategory } from './style-metadata'

export const batchJobStatusSchema = z.enum(['pending', 'running', 'completed', 'failed', 'cancelled'])

export const batchJobSchema = z.object({
  id: z.string(),
  game_slug: z.string(),
  model_id: z.string(),
  status: batchJobStatusSchema,
  created_at: z.string(),
  started_at: z.string().optional(),
  completed_at: z.string().optional(),
  run_id: z.string().optional(),
  error: z.string().optional(),
  retry_count: z.number().min(0).default(0),
  style: StyleCategory.optional()
})

export const batchConfigSchema = z.object({
  batch_id: z.string(),
  games: z.array(z.string()).min(1),
  models: z.array(z.string()).min(1),
  max_concurrency: z.number().min(1).max(10).default(3),
  retry_limit: z.number().min(0).max(5).default(3),
  created_at: z.string(),
  style: StyleCategory.optional()
})

export type BatchConfig = z.infer<typeof batchConfigSchema>
export type BatchJob = z.infer<typeof batchJobSchema>
export type BatchJobStatus = z.infer<typeof batchJobStatusSchema>

export interface BatchProgress {
  total_jobs: number
  pending: number
  running: number
  completed: number
  failed: number
  cancelled: number
}

export function createBatchId(): string {
  return `batch__${Date.now()}`
}

export function createJobId(game: string, model: string): string {
  return `${game}__${model}__${Date.now()}`
}

export class BatchState {
  private jobs: Map<string, BatchJob> = new Map()
  readonly batchId: string
  readonly config: BatchConfig

  constructor(config: BatchConfig) {
    this.batchId = config.batch_id
    this.config = config
  }

  addJob(gameSlug: string, modelId: string, style?: StyleCategory): BatchJob {
    const job: BatchJob = {
      id: createJobId(gameSlug, modelId),
      game_slug: gameSlug,
      model_id: modelId,
      status: 'pending',
      created_at: new Date().toISOString(),
      retry_count: 0,
      style
    }
    this.jobs.set(job.id, job)
    return job
  }

  getJob(jobId: string): BatchJob | undefined {
    return this.jobs.get(jobId)
  }

  getAllJobs(): BatchJob[] {
    return Array.from(this.jobs.values())
  }

  getJobsByStatus(status: BatchJobStatus): BatchJob[] {
    return this.getAllJobs().filter(j => j.status === status)
  }

  getRunningJobs(): BatchJob[] {
    return this.getJobsByStatus('running')
  }

  getPendingJobs(): BatchJob[] {
    return this.getJobsByStatus('pending')
  }

  startJob(jobId: string): void {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error(`Job ${jobId} not found`)
    job.status = 'running'
    job.started_at = new Date().toISOString()
  }

  completeJob(jobId: string, runId: string): void {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error(`Job ${jobId} not found`)
    job.status = 'completed'
    job.completed_at = new Date().toISOString()
    job.run_id = runId
  }

  failJob(jobId: string, error: string): void {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error(`Job ${jobId} not found`)
    job.status = 'failed'
    job.completed_at = new Date().toISOString()
    job.error = error
  }

  retryJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (!job) throw new Error(`Job ${jobId} not found`)
    if (job.retry_count >= this.config.retry_limit) {
      return false
    }
    job.status = 'pending'
    job.retry_count++
    job.error = undefined
    return true
  }

  getProgress(): BatchProgress {
    const jobs = this.getAllJobs()
    return {
      total_jobs: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      running: jobs.filter(j => j.status === 'running').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      cancelled: jobs.filter(j => j.status === 'cancelled').length
    }
  }

  isComplete(): boolean {
    const progress = this.getProgress()
    return progress.pending === 0 && progress.running === 0
  }
}

export function createBatchState(config: BatchConfig): BatchState {
  return new BatchState(config)
}