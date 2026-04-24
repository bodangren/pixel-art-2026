import { describe, it, expect } from 'vitest'
import { createBatchResult, batchResultSchema, exportResultsToCSV, exportResultsToJSON } from './batch-results'
import { batchConfigSchema } from './batch'

describe('batch results', () => {
  describe('createBatchResult', () => {
    it('aggregates model stats correctly', () => {
      const config = batchConfigSchema.parse({
        batch_id: 'batch__123',
        games: ['game1', 'game2'],
        models: ['model1', 'model2'],
        max_concurrency: 2,
        retry_limit: 2,
        created_at: '2026-04-24T00:00:00Z'
      })

      const jobs = [
        { id: 'job__1', game_slug: 'game1', model_id: 'model1', status: 'completed' as const, created_at: '', retry_count: 0, completed_at: '', run_id: 'run__1' },
        { id: 'job__2', game_slug: 'game2', model_id: 'model1', status: 'completed' as const, created_at: '', retry_count: 0, completed_at: '', run_id: 'run__2' },
        { id: 'job__3', game_slug: 'game1', model_id: 'model2', status: 'failed' as const, created_at: '', retry_count: 2, error: 'Failed' },
        { id: 'job__4', game_slug: 'game2', model_id: 'model2', status: 'completed' as const, created_at: '', retry_count: 0, completed_at: '', run_id: 'run__4' }
      ]

      const result = createBatchResult('batch__123', config.games, config.models, jobs as any, 5000)

      expect(result.total_jobs).toBe(4)
      expect(result.completed_jobs).toBe(3)
      expect(result.failed_jobs).toBe(1)
      expect(result.model_stats['model1'].games_completed).toBe(2)
      expect(result.model_stats['model1'].games_failed).toBe(0)
      expect(result.model_stats['model2'].games_completed).toBe(1)
      expect(result.model_stats['model2'].games_failed).toBe(1)
    })

    it('validates with schema', () => {
      const result = createBatchResult('batch__test', ['g1'], ['m1'], [] as any, 1000)
      const parsed = batchResultSchema.parse(result)
      expect(parsed.batch_id).toBe('batch__test')
    })
  })

  describe('exportResultsToCSV', () => {
    it('exports results to CSV format', () => {
      const results: any[] = [
        {
          batch_id: 'batch__001',
          created_at: '2026-04-24T00:00:00Z',
          games: ['game1'],
          models: ['model1'],
          total_jobs: 10,
          completed_jobs: 8,
          failed_jobs: 2,
          total_duration_ms: 5000,
          model_stats: {}
        }
      ]

      const csv = exportResultsToCSV(results)
      expect(csv).toContain('batch__001')
      expect(csv).toContain('10')
      expect(csv).toContain('8')
      expect(csv).toContain('5.0')
    })
  })

  describe('exportResultsToJSON', () => {
    it('exports results to JSON format', () => {
      const results: any[] = [
        {
          batch_id: 'batch__001',
          created_at: '2026-04-24T00:00:00Z',
          games: ['game1'],
          models: ['model1'],
          total_jobs: 5,
          completed_jobs: 5,
          failed_jobs: 0,
          total_duration_ms: 3000,
          model_stats: {}
        }
      ]

      const json = exportResultsToJSON(results)
      const parsed = JSON.parse(json)
      expect(parsed[0].batch_id).toBe('batch__001')
    })
  })
})