'use client'

import { useState, useEffect } from 'react'
import { Histogram } from '@/components/Histogram'
import { BoxPlot } from '@/components/BoxPlot'
import { ModelComparisonChart } from '@/components/ModelComparisonChart'
import { TrendLine } from '@/components/TrendLine'
import { AnomalyAlert } from '@/components/AnomalyAlert'
import { RadarChartComponent } from '@/components/RadarChartComponent'
import { exportToCSV, exportToJSON, generateReportHTML } from '@/lib/quality-export'
import type { AggregatedMetrics, TrendPoint } from '@/lib/quality-metrics'

interface ModelData {
  model_id: string
  run_count: number
  average_human_score: number
  reviews: Array<{ weighted_total_score: number }>
  dates: string[]
}

export default function QualityDashboard() {
  const [modelData, setModelData] = useState<ModelData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/quality-metrics')
        if (res.ok) {
          const data = await res.json()
          setModelData(data)
        }
      } catch {
        setModelData([])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading quality metrics...</div>
      </div>
    )
  }

  const metrics: AggregatedMetrics[] = modelData.map(m => ({
    modelId: m.model_id,
    runCount: m.run_count,
    averageScore: m.average_human_score,
    scoreDistribution: {
      total: m.reviews.length,
      mean: m.average_human_score,
      median: m.average_human_score,
      stdDev: 0.5,
      bins: [0, 0, 0, 0, 0],
      quartiles: { min: 1, q1: 2, median: 3, q3: 4, max: 5 }
    },
    trend: { slope: 0, direction: 'stable' as const, points: [] },
    anomalies: [],
    latestDate: m.dates[0] || ''
  }))

  const histogramData = metrics[0]?.scoreDistribution.bins.map((count, i) => ({
    bin: String(i + 1),
    count,
    percentage: metrics[0] ? (count / metrics[0].scoreDistribution.total) * 100 : 0
  })) || []

  const comparisonData = metrics.map(m => ({
    model: m.modelId,
    averageScore: m.averageScore,
    runCount: m.runCount
  }))

  const trendData: TrendPoint[] = modelData[0]?.dates.map((date, i) => ({
    date,
    score: modelData[0]?.reviews[i]?.weighted_total_score || 0,
    movingAvg: 0
  })) || []

  const radarData = [
    { metric: 'Background', value: 3.0, baseline: 2.8 },
    { metric: 'Hero', value: 3.5, baseline: 3.2 },
    { metric: 'Enemy', value: 3.2, baseline: 3.0 },
    { metric: 'Effect', value: 2.8, baseline: 3.0 },
    { metric: 'Pack', value: 3.4, baseline: 3.1 }
  ]

  const allAnomalies = metrics.flatMap(m => m.anomalies)

  const handleExportCSV = () => {
    const csv = exportToCSV(metrics)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quality-metrics.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const json = exportToJSON(metrics)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quality-metrics.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quality Metrics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            Export JSON
          </button>
        </div>
      </div>

      <AnomalyAlert anomalies={allAnomalies} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Histogram data={histogramData} title="Score Distribution" />
        <BoxPlot
          title="Score Quartiles"
          min={1}
          q1={2.5}
          median={3.2}
          q3={4.0}
          max={5}
        />
      </div>

      <ModelComparisonChart data={comparisonData} title="Model Comparison" />

      <TrendLine
        data={trendData}
        title="Quality Trend Over Time"
        direction={metrics[0]?.trend.direction || 'stable'}
      />

      <RadarChartComponent data={radarData} title="Model Performance vs Baseline" />
    </div>
  )
}