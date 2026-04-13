import { describe, it, expect } from 'vitest'
import { listRuns, getRun, getReview } from './data'

describe('Data Integrity Test (Integration)', () => {
  it('should be able to list and read the real mock data', async () => {
    const runs = await listRuns()
    expect(runs.length).toBeGreaterThan(0)
    
    const runId = 'gemini-3.1-pro__2026-04-04__r1'
    const run = await getRun(runId)
    expect(run.model_id).toBe('gemini-3.1-pro')
    
    const review = await getReview(runId)
    // Note: review might be null if JSON is invalid, but we expect it to be valid here
    expect(review).not.toBeNull()
    expect(review?.rubric_scores.background).toBe(2)
  })
})
