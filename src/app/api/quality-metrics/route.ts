import { NextResponse } from 'next/server'
import { listRuns, getReview } from '@/lib/data'
import type { Run, Review } from '@/lib/schemas'

export async function GET() {
  const runs = await listRuns()
  const models = Array.from(new Set(runs.map(r => r.model_id)))

  const modelData = await Promise.all(models.map(async (modelId) => {
    const modelRuns = runs.filter(r => r.model_id === modelId)
    const reviews = await Promise.all(
      modelRuns.map(async (r) => {
        const review = await getReview(r.run_id)
        return review ? { weighted_total_score: review.weighted_total_score } : null
      })
    )
    const validReviews = reviews.filter((r): r is { weighted_total_score: number } => r !== null)

    const avgScore = validReviews.length > 0
      ? validReviews.reduce((acc, r) => acc + r.weighted_total_score, 0) / validReviews.length
      : 0

    return {
      model_id: modelId,
      run_count: modelRuns.length,
      average_human_score: avgScore,
      reviews: validReviews,
      dates: modelRuns.map(r => r.run_date)
    }
  }))

  return NextResponse.json(modelData)
}