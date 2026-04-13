import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getRun, getReview, listRuns, saveReview } from './data'
import fs from 'fs/promises'

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    readdir: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  }
}))

describe('Data Fetching Utilities', () => {
  const mockRun = {
    run_id: 'test-run',
    model_id: 'test-model',
    run_date: '2026-04-04',
    variant: 'v1',
    benchmark_id: 'test-bench',
    prompt_version: '1.0',
    asset_paths: {
      background: 'bg.png',
      hero: 'hero.png',
      enemy: 'enemy.png',
      effect: 'effect.png'
    },
    status: 'completed'
  }

  const mockReview = {
    review_timestamp: '2026-04-04T12:00:00Z',
    rubric_scores: {
      background: 5,
      hero: 5,
      enemy: 5,
      effect: 5,
      pack: 5
    },
    notes: 'Perfect',
    weighted_total_score: 5,
    would_use_in_prototype_now: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch a run by id', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockRun))
    const run = await getRun('test-run')
    expect(run).toEqual(mockRun)
  })

  it('should fetch a review by run id', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockReview))
    const review = await getReview('test-run')
    expect(review).toEqual(mockReview)
  })

  it('should list all runs', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['run-1', 'run-2'] as any)
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockRun))
    const runs = await listRuns()
    expect(runs).toHaveLength(2)
    expect(runs[0]).toEqual(mockRun)
  })

  it('should save a review', async () => {
    await saveReview('test-run', mockReview)
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('public/data/runs/test-run/review.json'),
      expect.stringContaining('"weighted_total_score": 5'),
      'utf-8'
    )
  })
})
