import { describe, it, expect } from 'vitest';
import { batchConfigSchema, BatchState } from './batch';

describe('Style-aware BatchConfig', () => {
  it('accepts valid style parameter', () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__123',
      games: ['labyrinth-goblin-king'],
      models: ['gemini-3.1-pro'],
      max_concurrency: 3,
      retry_limit: 2,
      created_at: '2026-04-24T00:00:00Z',
      style: 'rpg'
    });
    expect(config.style).toBe('rpg');
  });

  it('accepts undefined style', () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__123',
      games: ['labyrinth-goblin-king'],
      models: ['gemini-3.1-pro'],
      max_concurrency: 3,
      retry_limit: 2,
      created_at: '2026-04-24T00:00:00Z'
    });
    expect(config.style).toBeUndefined();
  });

  it('rejects invalid style', () => {
    expect(() => batchConfigSchema.parse({
      batch_id: 'batch__123',
      games: ['labyrinth-goblin-king'],
      models: ['gemini-3.1-pro'],
      max_concurrency: 3,
      retry_limit: 2,
      created_at: '2026-04-24T00:00:00Z',
      style: 'invalid_style'
    })).toThrow();
  });
});

describe('Style-aware BatchJob', () => {
  it('addJob accepts optional style parameter', () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__123',
      games: ['labyrinth-goblin-king'],
      models: ['gemini-3.1-pro'],
      max_concurrency: 3,
      retry_limit: 2,
      created_at: '2026-04-24T00:00:00Z',
      style: 'isometric'
    });
    const state = new BatchState(config);
    const job = state.addJob('labyrinth-goblin-king', 'gemini-3.1-pro', 'isometric');
    expect(job.style).toBe('isometric');
  });

  it('addJob works without style', () => {
    const config = batchConfigSchema.parse({
      batch_id: 'batch__123',
      games: ['labyrinth-goblin-king'],
      models: ['gemini-3.1-pro'],
      max_concurrency: 3,
      retry_limit: 2,
      created_at: '2026-04-24T00:00:00Z'
    });
    const state = new BatchState(config);
    const job = state.addJob('labyrinth-goblin-king', 'gemini-3.1-pro');
    expect(job.style).toBeUndefined();
  });
});