import type { Run, Review } from './schemas'

export interface LeaderboardEntry {
  model_id: string
  run_count: number
  reviewed_count: number
  average_human_score: number
  average_tech_score: number
  best_human_score: number
  latest_run_date: string
  total_runs: number
}

export interface TechGrade {
  alignment_score: number
  palette_consistency_score: number
  transparency_score: number
  total_technical_score: number
  linter_notes: string
}

export interface LeaderboardFilters {
  genre?: string
  startDate?: string
  endDate?: string
  minRuns?: number
}

export function computeLeaderboard(
  runs: Run[],
  reviews: Record<string, Review | null>,
  techGrades: Record<string, TechGrade>
): LeaderboardEntry[] {
  const modelMap = new Map<string, {
    runs: Run[]
    humanScores: number[]
    techScores: number[]
  }>()

  for (const run of runs) {
    if (!modelMap.has(run.model_id)) {
      modelMap.set(run.model_id, { runs: [], humanScores: [], techScores: [] })
    }
    const entry = modelMap.get(run.model_id)!
    entry.runs.push(run)

    const review = reviews[run.run_id]
    if (review) {
      entry.humanScores.push(review.weighted_total_score)
    }

    const techGrade = techGrades[run.run_id]
    if (techGrade) {
      entry.techScores.push(techGrade.total_technical_score)
    }
  }

  const leaderboard: LeaderboardEntry[] = []

  for (const [modelId, data] of modelMap.entries()) {
    const avgHuman = data.humanScores.length > 0
      ? data.humanScores.reduce((a, b) => a + b, 0) / data.humanScores.length
      : 0

    const avgTech = data.techScores.length > 0
      ? data.techScores.reduce((a, b) => a + b, 0) / data.techScores.length
      : 0

    const bestHuman = data.humanScores.length > 0
      ? Math.max(...data.humanScores)
      : 0

    const sortedRuns = [...data.runs].sort((a, b) =>
      new Date(b.run_date).getTime() - new Date(a.run_date).getTime()
    )

    leaderboard.push({
      model_id: modelId,
      run_count: data.runs.length,
      reviewed_count: data.humanScores.length,
      average_human_score: Math.round(avgHuman * 10) / 10,
      average_tech_score: Math.round(avgTech * 10) / 10,
      best_human_score: Math.round(bestHuman * 10) / 10,
      latest_run_date: sortedRuns[0]?.run_date ?? '',
      total_runs: data.runs.length
    })
  }

  return leaderboard
}

export function filterLeaderboard(
  entries: LeaderboardEntry[],
  filters: LeaderboardFilters
): LeaderboardEntry[] {
  return entries.filter(entry => {
    if (filters.minRuns !== undefined && entry.run_count < filters.minRuns) {
      return false
    }

    if (filters.startDate && entry.latest_run_date < filters.startDate) {
      return false
    }

    if (filters.endDate && entry.latest_run_date > filters.endDate) {
      return false
    }

    return true
  })
}

export type SortKey = 'average_human_score' | 'average_tech_score' | 'run_count' | 'best_human_score' | 'name'
export type SortOrder = 'asc' | 'desc'

export function sortLeaderboard(
  entries: LeaderboardEntry[],
  sortKey: SortKey = 'average_human_score',
  order: SortOrder = 'desc'
): LeaderboardEntry[] {
  const sorted = [...entries].sort((a, b) => {
    let comparison = 0

    switch (sortKey) {
      case 'average_human_score':
        comparison = a.average_human_score - b.average_human_score
        break
      case 'average_tech_score':
        comparison = a.average_tech_score - b.average_tech_score
        break
      case 'run_count':
        comparison = a.run_count - b.run_count
        break
      case 'best_human_score':
        comparison = a.best_human_score - b.best_human_score
        break
      case 'name':
        comparison = a.model_id.toLowerCase().localeCompare(b.model_id.toLowerCase())
        if (order === 'desc') comparison = -comparison
        return comparison
    }

    return order === 'desc' ? -comparison : comparison
  })

  return sorted
}