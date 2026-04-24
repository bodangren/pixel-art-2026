import { describe, it, expect } from 'vitest'
import { calculateDistribution, calculateTrend, detectAnomalies } from './quality-metrics'

describe('QualityMetrics', () => {
  describe('calculateDistribution', () => {
    it('calculates histogram bins correctly', () => {
      const scores = [1, 2, 2, 3, 3, 3, 4, 4, 5]
      const dist = calculateDistribution(scores)
      expect(dist.total).toBe(9)
      expect(dist.mean).toBe(3)
      expect(dist.bins).toHaveLength(5)
      expect(dist.bins[0]).toBe(1)
      expect(dist.bins[1]).toBe(2)
      expect(dist.bins[2]).toBe(3)
      expect(dist.bins[3]).toBe(2)
      expect(dist.bins[4]).toBe(1)
    })

    it('calculates quartiles for box plot', () => {
      const scores = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const dist = calculateDistribution(scores)
      expect(dist.quartiles.q1).toBe(3)
      expect(dist.quartiles.median).toBe(5)
      expect(dist.quartiles.q3).toBe(7)
    })

    it('handles empty array', () => {
      const dist = calculateDistribution([])
      expect(dist.total).toBe(0)
      expect(dist.mean).toBe(0)
      expect(dist.bins).toHaveLength(5)
    })
  })

  describe('calculateTrend', () => {
    it('calculates moving average correctly', () => {
      const scores = [
        { date: '2026-04-01', score: 2.5 },
        { date: '2026-04-02', score: 3.0 },
        { date: '2026-04-03', score: 2.8 },
        { date: '2026-04-04', score: 3.5 },
        { date: '2026-04-05', score: 3.2 }
      ]
      const trend = calculateTrend(scores)
      expect(trend.slope).toBeDefined()
      expect(trend.points).toHaveLength(5)
    })

    it('detects upward trend', () => {
      const scores = [
        { date: '2026-04-01', score: 2.0 },
        { date: '2026-04-02', score: 2.5 },
        { date: '2026-04-03', score: 3.0 },
        { date: '2026-04-04', score: 3.5 },
        { date: '2026-04-05', score: 4.0 }
      ]
      const trend = calculateTrend(scores)
      expect(trend.slope).toBeGreaterThan(0)
    })

    it('detects downward trend', () => {
      const scores = [
        { date: '2026-04-01', score: 4.0 },
        { date: '2026-04-02', score: 3.5 },
        { date: '2026-04-03', score: 3.0 },
        { date: '2026-04-04', score: 2.5 },
        { date: '2026-04-05', score: 2.0 }
      ]
      const trend = calculateTrend(scores)
      expect(trend.slope).toBeLessThan(0)
    })
  })

  describe('detectAnomalies', () => {
    it('identifies scores below threshold', () => {
      const scores = [2.5, 3.0, 1.5, 3.5, 2.8]
      const anomalies = detectAnomalies(scores, 2.0)
      expect(anomalies).toHaveLength(1)
      expect(anomalies[0].value).toBe(1.5)
    })

    it('identifies scores above threshold', () => {
      const scores = [2.5, 4.5, 3.0, 4.8, 2.8]
      const anomalies = detectAnomalies(scores, 4.0, 'above')
      expect(anomalies.length).toBeGreaterThan(0)
    })

    it('returns empty for normal distribution', () => {
      const scores = [3.0, 3.1, 2.9, 3.0, 3.2]
      const anomalies = detectAnomalies(scores, 2.0)
      expect(anomalies).toHaveLength(0)
    })
  })
})