import fs from 'fs/promises'
import path from 'path'
import { runSchema, reviewSchema, type Run, type Review } from './schemas'
import { computeLeaderboard, sortLeaderboard, filterLeaderboard, type LeaderboardEntry, type LeaderboardFilters } from './leaderboard'

const DATA_DIR = path.join(process.cwd(), 'public/data/runs')
const DERIVED_DIR = path.join(process.cwd(), 'public/data/derived')

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

export async function getLeaderboard(
  filters?: LeaderboardFilters,
  sortKey?: 'average_human_score' | 'average_tech_score' | 'run_count' | 'best_human_score' | 'name',
  sortOrder?: 'asc' | 'desc'
): Promise<LeaderboardEntry[]> {
  const runsIndexPath = path.join(DERIVED_DIR, 'runs-index.json')
  const leaderboardDataPath = path.join(DERIVED_DIR, 'leaderboard.json')

  let runs: Run[] = []
  let techGrades: Record<string, { alignment_score: number; palette_consistency_score: number; transparency_score: number; total_technical_score: number; linter_notes: string }> = {}

  try {
    const runsIndexContent = await fs.readFile(runsIndexPath, 'utf-8')
    runs = JSON.parse(runsIndexContent)
  } catch {
    runs = await listRuns()
  }

  try {
    const leaderboardDataContent = await fs.readFile(leaderboardDataPath, 'utf-8')
    const leaderboardData = JSON.parse(leaderboardDataContent)
    for (const entry of leaderboardData) {
      if (runs.some(r => r.run_id.startsWith(entry.model_id.replace(/[^a-z0-9]/gi, '-'))) || runs.some(r => r.model_id.toLowerCase() === entry.model_id.toLowerCase())) {
        for (const run of runs.filter(r => r.model_id.toLowerCase() === entry.model_id.toLowerCase())) {
          techGrades[run.run_id] = {
            alignment_score: entry.total_alignment_score / entry.run_count,
            palette_consistency_score: entry.total_alignment_score / entry.run_count,
            transparency_score: entry.total_alignment_score / entry.run_count,
            total_technical_score: entry.total_tech_score / entry.run_count,
            linter_notes: ''
          }
        }
      }
    }
  } catch {
    // Tech grades not available
  }

  const reviews: Record<string, Review | null> = {}
  for (const run of runs) {
    reviews[run.run_id] = await getReview(run.run_id)
  }

  let entries = computeLeaderboard(runs, reviews, techGrades)

  if (filters) {
    entries = filterLeaderboard(entries, filters)
  }

  entries = sortLeaderboard(entries, sortKey ?? 'average_human_score', sortOrder ?? 'desc')

  return entries
}
