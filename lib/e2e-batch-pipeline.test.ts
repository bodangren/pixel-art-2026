import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runBatch } from './batch-orchestrator'
import { batchConfigSchema, createBatchState } from './batch'
import { createBatchResult } from './batch-results'

describe('E2E Batch Pipeline', () => {
  describe('Stage 1: LLM Generation', () => {
    it('generates run IDs for each game/model combination', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__gen__001',
        games: ['labyrinth-goblin-king', 'dungeon-crawler'],
        models: ['gemini-3.1-pro'],
        max_concurrency: 2,
        retry_limit: 2,
        created_at: '2026-05-02T00:00:00Z'
      })

      const executeFn = vi.fn().mockImplementation(async (game: string, model: string) => {
        return `${model}__${game}__2026-05-02__run1`
      })

      const state = await runBatch(config, executeFn)

      expect(executeFn).toHaveBeenCalledTimes(2)
      expect(executeFn).toHaveBeenCalledWith('labyrinth-goblin-king', 'gemini-3.1-pro')
      expect(executeFn).toHaveBeenCalledWith('dungeon-crawler', 'gemini-3.1-pro')
      expect(state.getProgress().completed).toBe(2)
    })

    it('respects retry limit on generation failure', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__gen__retry',
        games: ['failing-game'],
        models: ['mock-model'],
        max_concurrency: 1,
        retry_limit: 0,
        created_at: '2026-05-02T00:00:00Z'
      })

      const executeFn = vi.fn().mockRejectedValue(new Error('Generation failed'))

      const events = {
        onJobFail: vi.fn(),
        onJobRetry: vi.fn()
      }

      const state = await runBatch(config, executeFn, events)

      expect(events.onJobFail).toHaveBeenCalled()
      expect(state.getProgress().failed).toBe(1)
      expect(state.getProgress().completed).toBe(0)
    })
  })

  describe('Stage 2: Validation', () => {
    it('validates batch job completion against expected output', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__validation__001',
        games: ['game-a', 'game-b'],
        models: ['model-x', 'model-y'],
        max_concurrency: 4,
        retry_limit: 1,
        created_at: '2026-05-02T00:00:00Z'
      })

      const executeFn = vi.fn().mockResolvedValue('run__validated')

      const state = await runBatch(config, executeFn)

      const jobs = state.getAllJobs()
      expect(jobs.length).toBe(4)

      const completedJobs = jobs.filter(j => j.status === 'completed')
      expect(completedJobs.length).toBe(4)

      for (const job of completedJobs) {
        expect(job.run_id).toBeDefined()
        expect(job.run_id).toMatch(/^run__/)
      }
    })

    it('detects validation failures in job status', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__validation__fail',
        games: ['valid-game', 'invalid-game'],
        models: ['test-model'],
        max_concurrency: 1,
        retry_limit: 0,
        created_at: '2026-05-02T00:00:00Z'
      })

      const executeFn = vi.fn().mockImplementation(async (game) => {
        if (game === 'invalid-game') {
          throw new Error('Asset validation failed: incorrect dimensions')
        }
        return `run__${game}`
      })

      const state = await runBatch(config, executeFn)

      const failedJobs = state.getJobsByStatus('failed')
      expect(failedJobs.length).toBe(1)
      expect(failedJobs[0].game_slug).toBe('invalid-game')
      expect(failedJobs[0].error).toContain('validation failed')
    })
  })

  describe('Stage 3: Dashboard Display Aggregation', () => {
    it('aggregates results for dashboard display', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__display__001',
        games: ['game-1', 'game-2', 'game-3'],
        models: ['model-a', 'model-b'],
        max_concurrency: 3,
        retry_limit: 1,
        created_at: '2026-05-02T00:00:00Z'
      })

      const startTime = Date.now()
      const executeFn = vi.fn().mockResolvedValue('run__display')
      const state = await runBatch(config, executeFn)
      const endTime = Date.now()

      const allJobs = state.getAllJobs()
      const result = createBatchResult(
        config.batch_id,
        config.games,
        config.models,
        allJobs,
        endTime - startTime
      )

      expect(result.batch_id).toBe('e2e__display__001')
      expect(result.total_jobs).toBe(6)
      expect(result.completed_jobs).toBe(6)
      expect(result.failed_jobs).toBe(0)
      expect(result.games).toEqual(['game-1', 'game-2', 'game-3'])
      expect(result.models).toEqual(['model-a', 'model-b'])
      expect(result.model_stats['model-a'].games_completed).toBe(3)
      expect(result.model_stats['model-b'].games_completed).toBe(3)
    })

    it('handles mixed success/failure across models', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__display__mixed',
        games: ['game-x', 'game-y'],
        models: ['good-model', 'bad-model'],
        max_concurrency: 2,
        retry_limit: 0,
        created_at: '2026-05-02T00:00:00Z'
      })

      const executeFn = vi.fn().mockImplementation(async (_, model) => {
        if (model === 'bad-model') {
          throw new Error('Model generation failed')
        }
        return `run__${model}`
      })

      const state = await runBatch(config, executeFn)
      const allJobs = state.getAllJobs()
      const result = createBatchResult(config.batch_id, config.games, config.models, allJobs, 100)

      expect(result.completed_jobs).toBe(2)
      expect(result.failed_jobs).toBe(2)
      expect(result.model_stats['good-model'].games_completed).toBe(2)
      expect(result.model_stats['bad-model'].games_failed).toBe(2)
    })
  })

  describe('Full Pipeline Integration', () => {
    it('runs complete pipeline from generation to display', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__full__001',
        games: ['labyrinth-goblin-king', 'dungeon-crawler', 'space-invaders'],
        models: ['gemini-3.1-pro', 'gpt-5.3-codex-medium'],
        max_concurrency: 2,
        retry_limit: 1,
        created_at: '2026-05-02T00:00:00Z'
      })

      const startTime = Date.now()
      const executeFn = vi.fn().mockResolvedValue('run__full-pipeline')
      const state = await runBatch(config, executeFn)
      const endTime = Date.now()

      expect(state.getProgress().total_jobs).toBe(6)
      expect(state.getProgress().completed).toBe(6)
      expect(state.getProgress().failed).toBe(0)

      const allJobs = state.getAllJobs()
      const result = createBatchResult(
        config.batch_id,
        config.games,
        config.models,
        allJobs,
        endTime - startTime
      )

      expect(result.total_jobs).toBe(6)
      expect(result.completed_jobs).toBe(6)
      expect(result.total_duration_ms).toBeLessThan(5000)
    }, 10000)

    it('completes within 5 minute timeout', async () => {
      const config = batchConfigSchema.parse({
        batch_id: 'e2e__timeout__001',
        games: Array.from({ length: 10 }, (_, i) => `game-${i}`),
        models: ['fast-model'],
        max_concurrency: 5,
        retry_limit: 0,
        created_at: '2026-05-02T00:00:00Z'
      })

      const startTime = Date.now()
      const executeFn = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return 'run__timeout-test'
      })

      const state = await runBatch(config, executeFn)
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(300000)
      expect(state.getProgress().completed).toBe(10)
    }, 300000)
  })
})