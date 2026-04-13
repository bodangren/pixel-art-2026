import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs/promises'
import { buildDerivedData } from './build-derived-logic'

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    readdir: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  }
}))

describe('Build Derived Data Logic', () => {
  const mockRun1 = {
    run_id: 'run-1',
    model_id: 'model-a',
    run_date: '2026-04-01',
    status: 'completed',
    asset_paths: {}
  }
  const mockReview1 = {
    weighted_total_score: 4.5,
    review_timestamp: '2026-04-01T12:00:00Z'
  }
  const mockRun2 = {
    run_id: 'run-2',
    model_id: 'model-a',
    run_date: '2026-04-02',
    status: 'completed',
    asset_paths: {}
  }
  const mockReview2 = {
    weighted_total_score: 3.5,
    review_timestamp: '2026-04-02T12:00:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should aggregate runs and reviews into leaderboard data', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['run-1', 'run-2'] as any)
    
    vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
      if (path.includes('run-1/run.json')) return JSON.stringify(mockRun1)
      if (path.includes('run-1/review.json')) return JSON.stringify(mockReview1)
      if (path.includes('run-2/run.json')) return JSON.stringify(mockRun2)
      if (path.includes('run-2/review.json')) return JSON.stringify(mockReview2)
      throw new Error('File not found')
    })

    const leaderboard = await buildDerivedData()
    
    expect(leaderboard).toHaveLength(1) // One model
    expect(leaderboard[0].model_id).toBe('model-a')
    expect(leaderboard[0].average_human_score).toBe(4) // (4.5 + 3.5) / 2
    expect(leaderboard[0].run_count).toBe(2)
  })
})
