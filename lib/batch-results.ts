import { z } from 'zod'
import { batchJobSchema } from './batch'

export const batchResultSchema = z.object({
  batch_id: z.string(),
  created_at: z.string(),
  games: z.array(z.string()),
  models: z.array(z.string()),
  total_jobs: z.number(),
  completed_jobs: z.number(),
  failed_jobs: z.number(),
  total_duration_ms: z.number(),
  model_stats: z.record(z.string(), z.object({
    games_completed: z.number(),
    games_failed: z.number(),
    avg_duration_ms: z.number().optional()
  }))
})

export type BatchResult = z.infer<typeof batchResultSchema>
export type ModelStats = BatchResult['model_stats'][string]

export function createBatchResult(
  batchId: string,
  games: string[],
  models: string[],
  jobs: z.infer<typeof batchJobSchema>[],
  totalDurationMs: number
): BatchResult {
  const modelStats: BatchResult['model_stats'] = {}

  for (const model of models) {
    const modelJobs = jobs.filter(j => j.model_id === model)
    const completed = modelJobs.filter(j => j.status === 'completed').length
    const failed = modelJobs.filter(j => j.status === 'failed').length

    modelStats[model] = {
      games_completed: completed,
      games_failed: failed
    }
  }

  return {
    batch_id: batchId,
    created_at: new Date().toISOString(),
    games,
    models,
    total_jobs: jobs.length,
    completed_jobs: jobs.filter(j => j.status === 'completed').length,
    failed_jobs: jobs.filter(j => j.status === 'failed').length,
    total_duration_ms: totalDurationMs,
    model_stats: modelStats
  }
}

export function exportResultsToCSV(results: BatchResult[]): string {
  const headers = ['Batch ID', 'Created', 'Total Jobs', 'Completed', 'Failed', 'Duration (s)']
  const rows = results.map(r => [
    r.batch_id,
    r.created_at,
    r.total_jobs.toString(),
    r.completed_jobs.toString(),
    r.failed_jobs.toString(),
    (r.total_duration_ms / 1000).toFixed(1)
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

export function exportResultsToJSON(results: BatchResult[]): string {
  return JSON.stringify(results, null, 2)
}