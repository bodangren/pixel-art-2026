import { z } from 'zod'

export const runSchema = z.object({
  run_id: z.string(),
  model_id: z.string(),
  run_date: z.string(), // YYYY-MM-DD
  variant: z.string(),
  benchmark_id: z.string(),
  prompt_version: z.string(),
  asset_paths: z.object({
    background: z.string(),
    hero: z.string(),
    enemy: z.string(),
    effect: z.string()
  }),
  status: z.enum(['pending', 'completed', 'failed']),
  generation_notes: z.string().optional()
})

export const rubricScoresSchema = z.object({
  background: z.number().min(1).max(5),
  hero: z.number().min(1).max(5),
  enemy: z.number().min(1).max(5),
  effect: z.number().min(1).max(5),
  pack: z.number().min(1).max(5)
})

export const reviewSchema = z.object({
  review_timestamp: z.string(), // ISO String
  rubric_scores: rubricScoresSchema,
  notes: z.string(),
  weighted_total_score: z.number(),
  would_use_in_prototype_now: z.boolean()
})

export type Run = z.infer<typeof runSchema>
export type Review = z.infer<typeof reviewSchema>
export type RubricScores = z.infer<typeof rubricScoresSchema>
