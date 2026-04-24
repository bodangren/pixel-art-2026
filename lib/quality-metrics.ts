import type { Review, RubricScores } from './schemas'

export interface ScoreDistribution {
  total: number
  mean: number
  median: number
  stdDev: number
  bins: number[]
  quartiles: {
    min: number
    q1: number
    median: number
    q3: number
    max: number
  }
}

export interface TrendPoint {
  date: string
  score: number
  movingAvg?: number
}

export interface TrendAnalysis {
  slope: number
  direction: 'up' | 'down' | 'stable'
  points: TrendPoint[]
}

export interface Anomaly {
  value: number
  deviation: number
  direction: 'above' | 'below'
}

export function calculateDistribution(scores: number[]): ScoreDistribution {
  if (scores.length === 0) {
    return {
      total: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      bins: [0, 0, 0, 0, 0],
      quartiles: { min: 0, q1: 0, median: 0, q3: 0, max: 0 }
    }
  }

  const sorted = [...scores].sort((a, b) => a - b)
  const total = scores.length
  const mean = scores.reduce((a, b) => a + b, 0) / total

  const halfIdx = Math.floor(total / 2)
  const median = total % 2 === 0
    ? (sorted[halfIdx - 1] + sorted[halfIdx]) / 2
    : sorted[halfIdx]

  const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / total
  const stdDev = Math.sqrt(variance)

  const bins = [0, 0, 0, 0, 0]
  for (const score of scores) {
    const bin = Math.min(Math.max(Math.floor(score) - 1, 0), 4)
    bins[bin]++
  }

  const getQuantile = (arr: number[], p: number) => {
    const pos = p * (arr.length - 1)
    const base = Math.floor(pos)
    const rest = pos - base
    return arr[base] + rest * (arr[base + 1] - arr[base])
  }

  return {
    total,
    mean,
    median,
    stdDev,
    bins,
    quartiles: {
      min: sorted[0],
      q1: getQuantile(sorted, 0.25),
      median,
      q3: getQuantile(sorted, 0.75),
      max: sorted[total - 1]
    }
  }
}

export function calculateTrend(scores: { date: string; score: number }[]): TrendAnalysis {
  if (scores.length === 0) {
    return { slope: 0, direction: 'stable', points: [] }
  }

  const n = scores.length
  const points: TrendPoint[] = scores.map((s, i) => ({
    date: s.date,
    score: s.score,
    movingAvg: i >= 2
      ? scores.slice(Math.max(0, i - 2), i + 1).reduce((a, b) => a + b.score, 0) / Math.min(i + 1, 3)
      : s.score
  }))

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += scores[i].score
    sumXY += i * scores[i].score
    sumX2 += i * i
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (slope > 0.05) direction = 'up'
  else if (slope < -0.05) direction = 'down'

  return { slope, direction, points }
}

export function detectAnomalies(
  scores: number[],
  threshold: number,
  direction: 'above' | 'below' = 'below'
): Anomaly[] {
  if (scores.length === 0) return []

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const anomalies: Anomaly[] = []

  for (const score of scores) {
    if (direction === 'below' && score < threshold) {
      anomalies.push({ value: score, deviation: threshold - score, direction: 'below' })
    } else if (direction === 'above' && score > threshold) {
      anomalies.push({ value: score, deviation: score - threshold, direction: 'above' })
    }
  }

  return anomalies
}

export interface AggregatedMetrics {
  modelId: string
  runCount: number
  averageScore: number
  scoreDistribution: ScoreDistribution
  trend: TrendAnalysis
  anomalies: Anomaly[]
  latestDate: string
}

export async function aggregateModelMetrics(
  modelId: string,
  runs: Array<{ run_id: string; run_date: string }>,
  reviews: Review[]
): Promise<AggregatedMetrics> {
  const modelReviews = reviews.filter(() => true)

  const scores = modelReviews.map(r => r.weighted_total_score)
  const distribution = calculateDistribution(scores)
  const trend = calculateTrend(
    runs.map(r => ({ date: r.run_date, score: 0 }))
  )

  return {
    modelId,
    runCount: modelReviews.length,
    averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    scoreDistribution: distribution,
    trend,
    anomalies: detectAnomalies(scores, distribution.mean - distribution.stdDev),
    latestDate: runs[0]?.run_date || ''
  }
}