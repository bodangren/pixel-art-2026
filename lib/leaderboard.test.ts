import { describe, it, expect } from 'vitest'
import { computeLeaderboard, filterLeaderboard, sortLeaderboard, type LeaderboardEntry } from './leaderboard'

const mockRuns = [
  { run_id: 'run-1', model_id: 'Gemini-2.5-flash', run_date: '2026-04-04', variant: 'initial', benchmark_id: 'labyrinth', prompt_version: '1.0', asset_paths: { background: '', hero: '', enemy: '', effect: '' }, status: 'completed' as const },
  { run_id: 'run-2', model_id: 'Gemini-2.5-flash', run_date: '2026-04-05', variant: 'r1', benchmark_id: 'labyrinth', prompt_version: '1.0', asset_paths: { background: '', hero: '', enemy: '', effect: '' }, status: 'completed' as const },
  { run_id: 'run-3', model_id: 'sonnet-4.6', run_date: '2026-04-04', variant: 'initial', benchmark_id: 'labyrinth', prompt_version: '1.0', asset_paths: { background: '', hero: '', enemy: '', effect: '' }, status: 'completed' as const },
  { run_id: 'run-4', model_id: 'opus-4.6', run_date: '2026-04-04', variant: 'initial', benchmark_id: 'labyrinth', prompt_version: '1.0', asset_paths: { background: '', hero: '', enemy: '', effect: '' }, status: 'completed' as const },
]

const mockReviews: Record<string, { review_timestamp: string; rubric_scores: { background: number; hero: number; enemy: number; effect: number; pack: number }; notes: string; weighted_total_score: number; would_use_in_prototype_now: boolean } | null> = {
  'run-1': { review_timestamp: '2026-04-04T12:00:00Z', rubric_scores: { background: 5, hero: 4, enemy: 4, effect: 4, pack: 4 }, notes: 'Good', weighted_total_score: 4.2, would_use_in_prototype_now: true },
  'run-2': { review_timestamp: '2026-04-05T12:00:00Z', rubric_scores: { background: 3, hero: 3, enemy: 3, effect: 3, pack: 3 }, notes: 'OK', weighted_total_score: 3.0, would_use_in_prototype_now: false },
  'run-3': { review_timestamp: '2026-04-04T12:00:00Z', rubric_scores: { background: 5, hero: 5, enemy: 5, effect: 5, pack: 5 }, notes: 'Perfect', weighted_total_score: 5.0, would_use_in_prototype_now: true },
  'run-4': null,
}

const mockTechGrades: Record<string, { alignment_score: number; palette_consistency_score: number; transparency_score: number; total_technical_score: number; linter_notes: string }> = {
  'run-1': { alignment_score: 5, palette_consistency_score: 5, transparency_score: 5, total_technical_score: 5, linter_notes: '' },
  'run-2': { alignment_score: 4, palette_consistency_score: 4, transparency_score: 4, total_technical_score: 4, linter_notes: '' },
  'run-3': { alignment_score: 5, palette_consistency_score: 5, transparency_score: 5, total_technical_score: 5, linter_notes: '' },
  'run-4': { alignment_score: 3, palette_consistency_score: 3, transparency_score: 3, total_technical_score: 3, linter_notes: '' },
}

describe('computeLeaderboard', () => {
  it('should aggregate scores per model', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    expect(result).toHaveLength(3)
  })

  it('should compute average human score across runs', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    const gemini = result.find(m => m.model_id === 'Gemini-2.5-flash')
    expect(gemini?.average_human_score).toBe(3.6) // (4.2 + 3.0) / 2 = 3.6
  })

  it('should compute average tech score across runs', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    const gemini = result.find(m => m.model_id === 'Gemini-2.5-flash')
    expect(gemini?.average_tech_score).toBe(4.5) // (5 + 4) / 2 = 4.5
  })

  it('should handle missing reviews with score of 0', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    const opus = result.find(m => m.model_id === 'opus-4.6')
    expect(opus?.average_human_score).toBe(0)
    expect(opus?.average_tech_score).toBe(3)
  })

  it('should track run count correctly', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    const gemini = result.find(m => m.model_id === 'Gemini-2.5-flash')
    expect(gemini?.run_count).toBe(2)
  })

  it('should find best score per model', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    const sonnet = result.find(m => m.model_id === 'sonnet-4.6')
    expect(sonnet?.best_human_score).toBe(5.0)
  })

  it('should track latest run date per model', () => {
    const result = computeLeaderboard(mockRuns, mockReviews, mockTechGrades)
    const gemini = result.find(m => m.model_id === 'Gemini-2.5-flash')
    expect(gemini?.latest_run_date).toBe('2026-04-05')
  })
})

describe('filterLeaderboard', () => {
  const leaderboard: LeaderboardEntry[] = [
    { model_id: 'Gemini-2.5-flash', run_count: 2, reviewed_count: 2, average_human_score: 3.6, average_tech_score: 4.5, best_human_score: 4.2, latest_run_date: '2026-04-05', total_runs: 2 },
    { model_id: 'sonnet-4.6', run_count: 1, reviewed_count: 1, average_human_score: 5.0, average_tech_score: 5.0, best_human_score: 5.0, latest_run_date: '2026-04-04', total_runs: 1 },
    { model_id: 'opus-4.6', run_count: 1, reviewed_count: 0, average_human_score: 0, average_tech_score: 3.0, best_human_score: 0, latest_run_date: '2026-04-04', total_runs: 1 },
  ]

  it('should filter by minimum run count', () => {
    const result = filterLeaderboard(leaderboard, { minRuns: 2 })
    expect(result).toHaveLength(1)
    expect(result[0].model_id).toBe('Gemini-2.5-flash')
  })

  it('should filter by date range', () => {
    const result = filterLeaderboard(leaderboard, { startDate: '2026-04-05' })
    expect(result).toHaveLength(1)
    expect(result[0].model_id).toBe('Gemini-2.5-flash')
  })

  it('should filter by max date', () => {
    const result = filterLeaderboard(leaderboard, { endDate: '2026-04-04' })
    expect(result).toHaveLength(2)
  })

  it('should return all entries when no filters applied', () => {
    const result = filterLeaderboard(leaderboard, {})
    expect(result).toHaveLength(3)
  })

  it('should combine multiple filters', () => {
    const result = filterLeaderboard(leaderboard, { minRuns: 1, startDate: '2026-04-05' })
    expect(result).toHaveLength(1)
  })
})

describe('sortLeaderboard', () => {
  const leaderboard: LeaderboardEntry[] = [
    { model_id: 'Gemini-2.5-flash', run_count: 2, reviewed_count: 2, average_human_score: 3.6, average_tech_score: 4.5, best_human_score: 4.2, latest_run_date: '2026-04-05', total_runs: 2 },
    { model_id: 'sonnet-4.6', run_count: 1, reviewed_count: 1, average_human_score: 5.0, average_tech_score: 5.0, best_human_score: 5.0, latest_run_date: '2026-04-04', total_runs: 1 },
    { model_id: 'opus-4.6', run_count: 1, reviewed_count: 0, average_human_score: 0, average_tech_score: 3.0, best_human_score: 0, latest_run_date: '2026-04-04', total_runs: 1 },
  ]

  it('should sort by average human score descending by default', () => {
    const result = sortLeaderboard(leaderboard)
    expect(result[0].model_id).toBe('sonnet-4.6')
    expect(result[1].model_id).toBe('Gemini-2.5-flash')
    expect(result[2].model_id).toBe('opus-4.6')
  })

  it('should sort by average tech score', () => {
    const result = sortLeaderboard(leaderboard, 'average_tech_score')
    expect(result[0].model_id).toBe('sonnet-4.6')
    expect(result[1].model_id).toBe('Gemini-2.5-flash')
  })

  it('should sort by run count', () => {
    const result = sortLeaderboard(leaderboard, 'run_count')
    expect(result[0].model_id).toBe('Gemini-2.5-flash')
  })

  it('should sort by best human score', () => {
    const result = sortLeaderboard(leaderboard, 'best_human_score')
    expect(result[0].model_id).toBe('sonnet-4.6')
  })

  it('should sort by name ascending', () => {
    const result = sortLeaderboard(leaderboard, 'name', 'asc')
    expect(result[0].model_id).toBe('Gemini-2.5-flash')
    expect(result[1].model_id).toBe('opus-4.6')
    expect(result[2].model_id).toBe('sonnet-4.6')
  })

  it('should handle ascending order', () => {
    const result = sortLeaderboard(leaderboard, 'average_human_score', 'asc')
    expect(result[0].model_id).toBe('opus-4.6')
    expect(result[2].model_id).toBe('sonnet-4.6')
  })
})