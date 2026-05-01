import { describe, it, expect } from 'vitest'
import {
  calculateCompatibilityScore,
  generateCompatibilityReport,
  formatReportAsJSON,
  formatReportAsCSV,
  type CompatibilityResult,
} from './cross-engine-compatibility'

describe('cross-engine-compatibility', () => {
  describe('calculateCompatibilityScore', () => {
    it('calculates average score from multiple results', () => {
      const results: CompatibilityResult[] = [
        {
          engine: 'phaser',
          spriteTest: { testId: '1', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: true, durationMs: 100, errors: [] },
          tilemapTest: { testId: '1', tilemapPath: '', tileCount: 100, expectedTileCount: 100, passed: true, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '1', assetCount: 5, avgFps: 55, minFps: 50, maxFps: 60, memoryMB: 80, loadTimeMs: 500, passed: true, durationMs: 100, errors: [] },
          overallPassed: true,
          score: 100,
        },
        {
          engine: 'unity',
          spriteTest: { testId: '2', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: true, durationMs: 100, errors: [] },
          tilemapTest: { testId: '2', tilemapPath: '', tileCount: 100, expectedTileCount: 100, passed: true, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '2', assetCount: 5, avgFps: 45, minFps: 40, maxFps: 50, memoryMB: 90, loadTimeMs: 500, passed: false, durationMs: 100, errors: [] },
          overallPassed: false,
          score: 66,
        },
      ]

      const score = calculateCompatibilityScore(results)
      expect(score).toBe(83)
    })

    it('returns 0 for empty results', () => {
      const score = calculateCompatibilityScore([])
      expect(score).toBe(0)
    })

    it('handles single result', () => {
      const results: CompatibilityResult[] = [
        {
          engine: 'phaser',
          spriteTest: { testId: '1', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: true, durationMs: 100, errors: [] },
          tilemapTest: { testId: '1', tilemapPath: '', tileCount: 100, expectedTileCount: 100, passed: true, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '1', assetCount: 5, avgFps: 55, minFps: 50, maxFps: 60, memoryMB: 80, loadTimeMs: 500, passed: true, durationMs: 100, errors: [] },
          overallPassed: true,
          score: 95,
        },
      ]

      const score = calculateCompatibilityScore(results)
      expect(score).toBe(95)
    })
  })

  describe('generateCompatibilityReport', () => {
    it('generates report with all engines', () => {
      const results: CompatibilityResult[] = [
        {
          engine: 'phaser',
          spriteTest: { testId: '1', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: true, durationMs: 100, errors: [] },
          tilemapTest: { testId: '1', tilemapPath: '', tileCount: 100, expectedTileCount: 100, passed: true, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '1', assetCount: 5, avgFps: 55, minFps: 50, maxFps: 60, memoryMB: 80, loadTimeMs: 500, passed: true, durationMs: 100, errors: [] },
          overallPassed: true,
          score: 100,
        },
      ]

      const report = generateCompatibilityReport(results)

      expect(report.engines).toHaveLength(3)
      expect(report.engines[0].engine).toBe('phaser')
      expect(report.engines[0].spriteAnimationSupported).toBe(true)
      expect(report.engines[1].engine).toBe('unity')
      expect(report.engines[2].engine).toBe('godot')
    })

    it('adds recommendations for failed tests', () => {
      const results: CompatibilityResult[] = [
        {
          engine: 'phaser',
          spriteTest: { testId: '1', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: false, durationMs: 100, errors: ['Asset not found'] },
          tilemapTest: { testId: '1', tilemapPath: '', tileCount: 0, expectedTileCount: 100, passed: false, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '1', assetCount: 5, avgFps: 20, minFps: 15, maxFps: 25, memoryMB: 80, loadTimeMs: 500, passed: false, durationMs: 100, errors: [] },
          overallPassed: false,
          score: 0,
        },
      ]

      const report = generateCompatibilityReport(results)

      expect(report.recommendations.length).toBeGreaterThan(0)
      expect(report.recommendations.some(r => r.includes('phaser'))).toBe(true)
    })

    it('calculates overall score correctly', () => {
      const results: CompatibilityResult[] = [
        {
          engine: 'phaser',
          spriteTest: { testId: '1', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: true, durationMs: 100, errors: [] },
          tilemapTest: { testId: '1', tilemapPath: '', tileCount: 100, expectedTileCount: 100, passed: true, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '1', assetCount: 5, avgFps: 55, minFps: 50, maxFps: 60, memoryMB: 80, loadTimeMs: 500, passed: true, durationMs: 100, errors: [] },
          overallPassed: true,
          score: 100,
        },
        {
          engine: 'godot',
          spriteTest: { testId: '2', assetPath: '', frameCount: 4, expectedFrameCount: 4, passed: true, durationMs: 100, errors: [] },
          tilemapTest: { testId: '2', tilemapPath: '', tileCount: 100, expectedTileCount: 100, passed: true, durationMs: 100, errors: [], layerResults: [] },
          perfTest: { testId: '2', assetCount: 5, avgFps: 55, minFps: 50, maxFps: 60, memoryMB: 80, loadTimeMs: 500, passed: true, durationMs: 100, errors: [] },
          overallPassed: true,
          score: 100,
        },
      ]

      const report = generateCompatibilityReport(results)
      expect(report.overallScore).toBe(100)
    })
  })

  describe('formatReportAsJSON', () => {
    it('formats report as valid JSON', () => {
      const report = generateCompatibilityReport([])
      const json = formatReportAsJSON(report)

      expect(() => JSON.parse(json)).not.toThrow()
    })
  })

  describe('formatReportAsCSV', () => {
    it('formats report as CSV', () => {
      const report = generateCompatibilityReport([])
      const csv = formatReportAsCSV(report)

      expect(csv).toContain('Engine,Sprite Animation,Tilemap,Performance')
      expect(csv).toContain('Overall Score')
      expect(csv).toContain('Recommendations')
    })

    it('includes all engines in CSV', () => {
      const report = generateCompatibilityReport([])
      const csv = formatReportAsCSV(report)

      expect(csv).toContain('phaser')
      expect(csv).toContain('unity')
      expect(csv).toContain('godot')
    })
  })
})