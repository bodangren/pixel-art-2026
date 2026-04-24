import { describe, it, expect } from 'vitest'
import { batchConfigSchema, BatchState, createBatchState } from './batch'

describe('BatchState', () => {
  const validConfig = batchConfigSchema.parse({
    batch_id: 'batch__123',
    games: ['labyrinth-goblin-king', 'dungeon-crawler'],
    models: ['gemini-3.1-pro', 'gpt-5.3-codex-medium'],
    max_concurrency: 3,
    retry_limit: 2,
    created_at: '2026-04-24T00:00:00Z'
  })

  describe('constructor', () => {
    it('creates BatchState with config', () => {
      const state = new BatchState(validConfig)
      expect(state.batchId).toBe('batch__123')
      expect(state.config).toBe(validConfig)
    })
  })

  describe('addJob', () => {
    it('adds a job with pending status', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('labyrinth-goblin-king', 'gemini-3.1-pro')
      expect(job.status).toBe('pending')
      expect(job.game_slug).toBe('labyrinth-goblin-king')
      expect(job.model_id).toBe('gemini-3.1-pro')
      expect(job.retry_count).toBe(0)
    })

    it('returns a job that can be retrieved', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('labyrinth-goblin-king', 'gemini-3.1-pro')
      const retrieved = state.getJob(job.id)
      expect(retrieved?.id).toBe(job.id)
    })
  })

  describe('getJob', () => {
    it('returns undefined for non-existent job', () => {
      const state = new BatchState(validConfig)
      expect(state.getJob('nonexistent')).toBeUndefined()
    })
  })

  describe('getAllJobs', () => {
    it('returns empty array initially', () => {
      const state = new BatchState(validConfig)
      expect(state.getAllJobs()).toEqual([])
    })

    it('returns all added jobs', () => {
      const state = new BatchState(validConfig)
      state.addJob('game1', 'model1')
      state.addJob('game2', 'model2')
      expect(state.getAllJobs().length).toBe(2)
    })
  })

  describe('getJobsByStatus', () => {
    it('filters jobs by status', () => {
      const state = new BatchState(validConfig)
      const job1 = state.addJob('game1', 'model1')
      state.addJob('game2', 'model2')
      state.startJob(job1.id)
      expect(state.getJobsByStatus('running').length).toBe(1)
      expect(state.getJobsByStatus('pending').length).toBe(1)
    })
  })

  describe('startJob', () => {
    it('marks job as running with timestamp', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('game1', 'model1')
      state.startJob(job.id)
      const updated = state.getJob(job.id)
      expect(updated?.status).toBe('running')
      expect(updated?.started_at).toBeDefined()
    })

    it('throws for non-existent job', () => {
      const state = new BatchState(validConfig)
      expect(() => state.startJob('nonexistent')).toThrow('Job nonexistent not found')
    })
  })

  describe('completeJob', () => {
    it('marks job as completed with run_id', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('game1', 'model1')
      state.completeJob(job.id, 'run__123')
      const updated = state.getJob(job.id)
      expect(updated?.status).toBe('completed')
      expect(updated?.run_id).toBe('run__123')
      expect(updated?.completed_at).toBeDefined()
    })
  })

  describe('failJob', () => {
    it('marks job as failed with error message', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('game1', 'model1')
      state.failJob(job.id, 'Generation timeout')
      const updated = state.getJob(job.id)
      expect(updated?.status).toBe('failed')
      expect(updated?.error).toBe('Generation timeout')
    })
  })

  describe('retryJob', () => {
    it('resets job to pending and increments retry_count', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('game1', 'model1')
      state.failJob(job.id, 'Error')
      const retried = state.retryJob(job.id)
      expect(retried).toBe(true)
      const updated = state.getJob(job.id)
      expect(updated?.status).toBe('pending')
      expect(updated?.retry_count).toBe(1)
      expect(updated?.error).toBeUndefined()
    })

    it('returns false when retry limit exceeded', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('game1', 'model1')
      state.failJob(job.id, 'Error')
      state.retryJob(job.id) // retry_count = 1
      state.failJob(job.id, 'Error')
      state.retryJob(job.id) // retry_count = 2
      const retried = state.retryJob(job.id) // should fail - limit is 2
      expect(retried).toBe(false)
    })
  })

  describe('getProgress', () => {
    it('tracks job counts correctly', () => {
      const state = new BatchState(validConfig)
      const job1 = state.addJob('game1', 'model1')
      const job2 = state.addJob('game2', 'model2')
      const job3 = state.addJob('game3', 'model3')
      state.startJob(job1.id)
      state.completeJob(job2.id, 'run__2')
      state.failJob(job3.id, 'Error')

      const progress = state.getProgress()
      expect(progress.total_jobs).toBe(3)
      expect(progress.pending).toBe(0)
      expect(progress.running).toBe(1)
      expect(progress.completed).toBe(1)
      expect(progress.failed).toBe(1)
    })
  })

  describe('isComplete', () => {
    it('returns false when jobs are pending or running', () => {
      const state = new BatchState(validConfig)
      state.addJob('game1', 'model1')
      expect(state.isComplete()).toBe(false)
    })

    it('returns true when all jobs are done', () => {
      const state = new BatchState(validConfig)
      const job = state.addJob('game1', 'model1')
      state.completeJob(job.id, 'run__1')
      expect(state.isComplete()).toBe(true)
    })
  })

  describe('createBatchState', () => {
    it('factory function creates BatchState', () => {
      const state = createBatchState(validConfig)
      expect(state).toBeInstanceOf(BatchState)
      expect(state.batchId).toBe('batch__123')
    })
  })
})