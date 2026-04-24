import { describe, it, expect } from 'vitest'
import { batchConfigSchema, batchJobSchema, createBatchId, createJobId } from './batch'

describe('batch schemas', () => {
  describe('batchConfigSchema', () => {
    it('validates a valid batch config', () => {
      const config = {
        batch_id: 'batch__123',
        games: ['labyrinth-goblin-king'],
        models: ['gemini-3.1-pro'],
        max_concurrency: 3,
        retry_limit: 3,
        created_at: '2026-04-24T00:00:00Z'
      }
      expect(() => batchConfigSchema.parse(config)).not.toThrow()
    })

    it('applies default values for optional fields', () => {
      const config = {
        batch_id: 'batch__123',
        games: ['labyrinth-goblin-king'],
        models: ['gemini-3.1-pro'],
        created_at: '2026-04-24T00:00:00Z'
      }
      const parsed = batchConfigSchema.parse(config)
      expect(parsed.max_concurrency).toBe(3)
      expect(parsed.retry_limit).toBe(3)
    })

    it('rejects empty games array', () => {
      const config = {
        batch_id: 'batch__123',
        games: [],
        models: ['gemini-3.1-pro'],
        created_at: '2026-04-24T00:00:00Z'
      }
      expect(() => batchConfigSchema.parse(config)).toThrow()
    })

    it('rejects empty models array', () => {
      const config = {
        batch_id: 'batch__123',
        games: ['labyrinth-goblin-king'],
        models: [],
        created_at: '2026-04-24T00:00:00Z'
      }
      expect(() => batchConfigSchema.parse(config)).toThrow()
    })

    it('rejects max_concurrency > 10', () => {
      const config = {
        batch_id: 'batch__123',
        games: ['labyrinth-goblin-king'],
        models: ['gemini-3.1-pro'],
        max_concurrency: 11,
        created_at: '2026-04-24T00:00:00Z'
      }
      expect(() => batchConfigSchema.parse(config)).toThrow()
    })

    it('rejects retry_limit > 5', () => {
      const config = {
        batch_id: 'batch__123',
        games: ['labyrinth-goblin-king'],
        models: ['gemini-3.1-pro'],
        retry_limit: 6,
        created_at: '2026-04-24T00:00:00Z'
      }
      expect(() => batchConfigSchema.parse(config)).toThrow()
    })
  })

  describe('batchJobSchema', () => {
    it('validates a valid batch job', () => {
      const job = {
        id: 'job__123',
        game_slug: 'labyrinth-goblin-king',
        model_id: 'gemini-3.1-pro',
        status: 'pending',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 0
      }
      expect(() => batchJobSchema.parse(job)).not.toThrow()
    })

    it('rejects invalid status', () => {
      const job = {
        id: 'job__123',
        game_slug: 'labyrinth-goblin-king',
        model_id: 'gemini-3.1-pro',
        status: 'invalid-status',
        created_at: '2026-04-24T00:00:00Z'
      }
      expect(() => batchJobSchema.parse(job)).toThrow()
    })

    it('defaults retry_count to 0', () => {
      const job = {
        id: 'job__123',
        game_slug: 'labyrinth-goblin-king',
        model_id: 'gemini-3.1-pro',
        status: 'pending',
        created_at: '2026-04-24T00:00:00Z'
      }
      const parsed = batchJobSchema.parse(job)
      expect(parsed.retry_count).toBe(0)
    })

    it('allows optional timing fields when running', () => {
      const job = {
        id: 'job__123',
        game_slug: 'labyrinth-goblin-king',
        model_id: 'gemini-3.1-pro',
        status: 'running',
        created_at: '2026-04-24T00:00:00Z',
        started_at: '2026-04-24T00:01:00Z'
      }
      expect(() => batchJobSchema.parse(job)).not.toThrow()
    })

    it('allows optional error field when failed', () => {
      const job = {
        id: 'job__123',
        game_slug: 'labyrinth-goblin-king',
        model_id: 'gemini-3.1-pro',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        error: 'Generation timed out after 120s'
      }
      expect(() => batchJobSchema.parse(job)).not.toThrow()
    })
  })

  describe('createBatchId', () => {
    it('creates batch id with prefix', () => {
      const id = createBatchId()
      expect(id.startsWith('batch__')).toBe(true)
    })

    it('creates ids that are strings', () => {
      const id = createBatchId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(7)
    })
  })

  describe('createJobId', () => {
    it('creates job id with game and model', () => {
      const id = createJobId('labyrinth-goblin-king', 'gemini-3.1-pro')
      expect(id).toContain('labyrinth-goblin-king')
      expect(id).toContain('gemini-3.1-pro')
    })
  })
})