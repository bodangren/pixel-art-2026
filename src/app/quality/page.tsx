import { listRuns, getReview } from '../../../lib/data'
import type { Review } from '../../../lib/schemas'
import { Histogram } from '@/components/Histogram'
import { BoxPlot } from '@/components/BoxPlot'
import { ModelComparisonChart } from '@/components/ModelComparisonChart'
import { TrendLine } from '@/components/TrendLine'
import { AnomalyAlert } from '@/components/AnomalyAlert'
import { RadarChartComponent } from '@/components/RadarChartComponent'
import ExportButton from '@/components/ExportButton'
import { detectAnomalies, calculateDistribution, calculateTrend } from '../../../lib/quality-metrics'

interface ModelMetrics {
  modelId: string
  runCount: number
  averageScore: number
  scores: number[]
  dates: string[]
}

async function getModelMetrics(): Promise<ModelMetrics[]> {
  const runs = await listRuns()
  const models = Array.from(new Set(runs.map(r => r.model_id)))

  return await Promise.all(models.map(async (modelId) => {
    const modelRuns = runs.filter(r => r.model_id === modelId)
    const reviews: Review[] = []

    for (const run of modelRuns) {
      const review = await getReview(run.run_id)
      if (review) reviews.push(review)
    }

    const scores = reviews.map(r => r.weighted_total_score)
    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0

    return {
      modelId,
      runCount: modelRuns.length,
      averageScore: avgScore,
      scores,
      dates: modelRuns.map(r => r.run_date)
    }
  }))
}

export default async function QualityDashboard() {
  const modelMetrics = await getModelMetrics()

  const histogramData = modelMetrics[0]
    ? calculateDistribution(modelMetrics[0].scores).bins.map((count, i) => ({
        bin: String(i + 1),
        count,
        percentage: modelMetrics[0] ? (count / modelMetrics[0].scores.length) * 100 : 0
      }))
    : []

  const comparisonData = modelMetrics.map(m => ({
    model: m.modelId,
    averageScore: m.averageScore,
    runCount: m.runCount
  }))

  const allScores = modelMetrics.flatMap(m => m.scores)
  const allAnomalies = detectAnomalies(allScores, calculateDistribution(allScores).mean - calculateDistribution(allScores).stdDev)

  const trendData = modelMetrics[0]
    ? modelMetrics[0].dates.map((date, i) => ({
        date,
        score: modelMetrics[0]!.scores[i] || 0,
        movingAvg: 0
      }))
    : []

  const dist = calculateDistribution(allScores)

  const radarData = [
    { metric: 'Background', value: 3.0, baseline: 2.8 },
    { metric: 'Hero', value: 3.5, baseline: 3.2 },
    { metric: 'Enemy', value: 3.2, baseline: 3.0 },
    { metric: 'Effect', value: 2.8, baseline: 3.0 },
    { metric: 'Pack', value: 3.4, baseline: 3.1 }
  ]

  const exportData = modelMetrics.map(m => ({
    model: m.modelId,
    runs: m.runCount,
    avg_score: m.averageScore.toFixed(2),
    scores: m.scores.join(';')
  }))

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quality Metrics Dashboard</h1>
        <ExportButton
          exportType="csv"
          data={exportData}
          filename={`quality-metrics-${new Date().toISOString().split('T')[0]}.csv`}
          label="Export CSV"
        />
      </div>

      <AnomalyAlert anomalies={allAnomalies} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Histogram data={histogramData} title="Score Distribution" />
        <BoxPlot
          title="Score Quartiles"
          min={dist.quartiles.min}
          q1={dist.quartiles.q1}
          median={dist.quartiles.median}
          q3={dist.quartiles.q3}
          max={dist.quartiles.max}
        />
      </div>

      <ModelComparisonChart data={comparisonData} title="Model Comparison" />

      <TrendLine
        data={trendData}
        title="Quality Trend Over Time"
        direction={calculateTrend(modelMetrics[0]?.dates.map((d, i) => ({ date: d, score: modelMetrics[0]?.scores[i] || 0 })) || []).direction}
      />

      <RadarChartComponent data={radarData} title="Model Performance vs Baseline" />
    </div>
  )
}