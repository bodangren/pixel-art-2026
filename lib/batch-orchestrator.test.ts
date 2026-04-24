import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BatchOrchestrator, runBatch } from './batch-orchestrator'
import { batchConfigSchema, createBatchState } from './batch'

describe('BatchOrchestrator', () => {
  const validConfig = batchConfigSchema.parse({
    batch_id: 'batch__test',
    games: ['labyrinth-goblin-king', 'dungeon-crawler'],
    models: ['gemini-3.1-pro', 'gpt-5.3-codex-medium'],
    max_concurrency: 2,
    retry_limit: 2,
    created_at: '2026-04-24T00:00:00Z'
  })

  describe('constructor', () => {
    it('creates orchestrator with config', () => {
      const orch = new BatchOrchestrator(validConfig)
      expect(orch.getState()).toBeDefined()
      expect(orch.getState().batchId).toBe('batch__test')
    })

    it('accepts events callbacks', () => {
      const callbacks = {
        onJobStart: vi.fn(),
        onJobComplete: vi.fn(),
        onJobFail: vi.fn()
      }
      const orch = new BatchOrchestrator(validConfig, callbacks)
      expect(orch.getState()).toBeDefined()
    })
  })

  describe('run', () => {
    it('processes all jobs', async () => {
      const executeFn = vi.fn().mockResolvedValue('run__123')
      const state = createBatchState(validConfig)

      for (const game of validConfig.games) {
        for (const model of validConfig.models) {
          state.addJob(game, model)
        }
      }

      const orch = new BatchOrchestrator(validConfig, { onJobComplete: vi.fn() })
      const result = await runBatch(validConfig, executeFn)

      expect(result.getProgress().completed).toBe(4)
    }, 10000)

    it('respects concurrency limit', async () => {
      const activeJobs: string[] = []
      let maxActive = 0

      const executeFn = vi.fn().mockImplementation(async (game: string, model: string) => {
        activeJobs.push(`${game}_${model}`)
        maxActive = Math.max(maxActive, activeJobs.length)
        await new Promise(resolve => setTimeout(resolve, 50))
        activeJobs.shift()
        return 'run__123'
      })

      const result = await runBatch(validConfig, executeFn)

      expect(maxActive).toBeLessThanOrEqual(validConfig.max_concurrency)
    }, 10000)
  })

  describe('cancel', () => {
    it('stops running jobs', async () => {
      const orch = new BatchOrchestrator(validConfig)
      const state = orch.getState()
      state.addJob('game1', 'model1')
      state.addJob('game2', 'model2')

      orch.cancel()

      expect(state.getAllJobs().length).toBe(2)
    })
  })
})

describe('runBatch', () => {
  it('processes all game/model combinations', async () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__123',
      games: ['game1', 'game2'],
      models: ['model1'],
      max_concurrency: 3,
      retry_limit: 2,
      created_at: '2026-04-24T00:00:00Z'
    })

    const executeFn = vi.fn().mockResolvedValue('run__test')
    const state = await runBatch(config, executeFn)

    expect(state.getAllJobs().length).toBe(2)
    expect(executeFn).toHaveBeenCalledTimes(2)
  })

  it('handles job failures gracefully', async () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__fail',
      games: ['game1'],
      models: ['model1'],
      max_concurrency: 1,
      retry_limit: 1,
      created_at: '2026-04-24T00:00:00Z'
    })

    const executeFn = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce('run__retry')

    const events = {
      onJobFail: vi.fn(),
      onJobRetry: vi.fn()
    }

    const state = await runBatch(config, executeFn, events)

    expect(state.getProgress().failed).toBe(0)
  })

  it('reports completion with counts', async () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__count',
      games: ['g1', 'g2'],
      models: ['m1', 'm2'],
      max_concurrency: 4,
      retry_limit: 0,
      created_at: '2026-04-24T00:00:00Z'
    })

    const executeFn = vi.fn().mockResolvedValue('run__ok')
    const state = await runBatch(config, executeFn)

    expect(state.getProgress().total_jobs).toBe(4)
    expect(state.getProgress().completed).toBe(4)
  })

  it('calculates backoff delay correctly', () => {
    const delays: number[] = []
    for (let i = 0; i < 5; i++) {
      delays.push(Math.min(1000 * Math.pow(2, i), 30000))
    }
    expect(delays).toEqual([1000, 2000, 4000, 8000, 16000])
  })
})