import fs from 'fs/promises'
import path from 'path'
import { runSchema, reviewSchema, type Run, type Review } from './schemas'

const DATA_DIR = path.join(process.cwd(), 'public/data/runs')

export async function getRun(runId: string): Promise<Run> {
  const runPath = path.join(DATA_DIR, runId, 'run.json')
  const content = await fs.readFile(runPath, 'utf-8')
  return runSchema.parse(JSON.parse(content))
}

export async function getReview(runId: string): Promise<Review | null> {
  const reviewPath = path.join(DATA_DIR, runId, 'review.json')
  try {
    const content = await fs.readFile(reviewPath, 'utf-8')
    return reviewSchema.parse(JSON.parse(content))
  } catch {
    return null
  }
}

export async function listRuns(): Promise<Run[]> {
  try {
    const runDirs = await fs.readdir(DATA_DIR)
    const runs = await Promise.all(
      runDirs.map(async (runId) => {
        try {
          return await getRun(runId)
        } catch {
          return null
        }
      })
    )
    return runs.filter((run): run is Run => run !== null)
  } catch {
    return []
  }
}

export async function saveReview(runId: string, review: Review): Promise<void> {
  const reviewPath = path.join(DATA_DIR, runId, 'review.json')
  await fs.writeFile(reviewPath, JSON.stringify(review, null, 2), 'utf-8')
}

// Temporary stub for leaderboard until Phase 5
export async function getLeaderboard(): Promise<any[]> {
  const runs = await listRuns()
  const models = Array.from(new Set(runs.map(r => r.model_id)))
  
  const leaderboard = await Promise.all(models.map(async (modelId) => {
    const modelRuns = runs.filter(r => r.model_id === modelId)
    const reviews = await Promise.all(modelRuns.map(r => getReview(r.run_id)))
    const validReviews = reviews.filter((r): r is Review => r !== null)
    
    const avgHumanScore = validReviews.length > 0 
      ? validReviews.reduce((acc, r) => acc + r.weighted_total_score, 0) / validReviews.length
      : 0

    return {
      model_id: modelId,
      run_count: modelRuns.length,
      average_human_score: avgHumanScore,
      average_tech_score: 0, // Placeholder
      latest_run_date: modelRuns[0]?.run_date
    }
  }))

  return leaderboard.sort((a, b) => b.average_human_score - a.average_human_score)
}
