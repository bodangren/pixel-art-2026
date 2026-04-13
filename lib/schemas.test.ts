import { describe, it, expect } from 'vitest'
import { runSchema, reviewSchema } from './schemas'

describe('Run Schema', () => {
  it('should validate a correct run object', () => {
    const validRun = {
      run_id: 'gpt-4o__2026-04-04__r1',
      model_id: 'gpt-4o',
      run_date: '2026-04-04',
      variant: 'r1',
      benchmark_id: 'labyrinth-goblin-king',
      prompt_version: 'v1.0',
      asset_paths: {
        background: 'assets/background.png',
        hero: 'assets/hero-3x3-sheet.png',
        enemy: 'assets/goblin-3x3-sheet.png',
        effect: 'assets/orb-sheet.png'
      },
      status: 'completed',
      generation_notes: 'Generated using default settings'
    }
    expect(runSchema.parse(validRun)).toEqual(validRun)
  })

  it('should fail if required fields are missing', () => {
    const invalidRun = {
      run_id: 'gpt-4o__2026-04-04__r1'
    }
    expect(() => runSchema.parse(invalidRun)).toThrow()
  })
})

describe('Review Schema', () => {
  it('should validate a correct review object', () => {
    const validReview = {
      review_timestamp: '2026-04-04T12:00:00Z',
      rubric_scores: {
        background: 4,
        hero: 5,
        enemy: 3,
        effect: 4,
        pack: 4
      },
      notes: 'Overall high quality',
      weighted_total_score: 4.1,
      would_use_in_prototype_now: true
    }
    expect(reviewSchema.parse(validReview)).toEqual(validReview)
  })

  it('should fail if scores are out of range', () => {
    const invalidReview = {
      review_timestamp: '2026-04-04T12:00:00Z',
      rubric_scores: {
        background: 6, // Out of range (assume 1-5)
        hero: 5,
        enemy: 3,
        effect: 4,
        pack: 4
      },
      notes: 'Overall high quality',
      weighted_total_score: 4.1,
      would_use_in_prototype_now: true
    }
    expect(() => reviewSchema.parse(invalidReview)).toThrow()
  })
})
