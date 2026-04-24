import { describe, it, expect } from 'vitest'
import { exportToCSV, exportToJSON, generateReportHTML } from './quality-export'
import type { AggregatedMetrics } from './quality-metrics'

describe('QualityExport', () => {
  const mockMetrics: AggregatedMetrics[] = [
    {
      modelId: 'Model A',
      runCount: 5,
      averageScore: 3.2,
      scoreDistribution: {
        total: 5, mean: 3.2, median: 3.2, stdDev: 0.4,
        bins: [0, 1, 2, 1, 1],
        quartiles: { min: 2.5, q1: 2.8, median: 3.2, q3: 3.5, max: 4.0 }
      },
      trend: { slope: 0.1, direction: 'up', points: [] },
      anomalies: [{ value: 2.0, deviation: 0.8, direction: 'below' }],
      latestDate: '2026-04-24'
    }
  ]

  describe('exportToCSV', () => {
    it('generates valid CSV', () => {
      const csv = exportToCSV(mockMetrics)
      expect(csv).toContain('Model,Runs,Avg Score')
      expect(csv).toContain('Model A,5,3.20')
    })

    it('handles empty metrics', () => {
      const csv = exportToCSV([])
      expect(csv).toContain('Model,Runs,Avg Score')
    })
  })

  describe('exportToJSON', () => {
    it('generates valid JSON', () => {
      const json = exportToJSON(mockMetrics)
      expect(JSON.parse(json)).toBeTruthy()
      expect(json).toContain('Model A')
    })
  })

  describe('generateReportHTML', () => {
    it('generates valid HTML', () => {
      const html = generateReportHTML(mockMetrics)
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Model A')
      expect(html).toContain('Quality Metrics Report')
    })
  })
})