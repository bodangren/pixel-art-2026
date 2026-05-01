import { z } from 'zod'
import type { IntegrationTestResult } from './game-engine-test-framework'
import type { TilemapRenderTestResult } from './tilemap-render-test'
import type { SpriteAnimationTestResult } from './sprite-animation-test'
import type { PerformanceBenchmarkResult } from './performance-benchmark'

export const EngineCompatibilitySchema = z.object({
  engine: z.enum(['phaser', 'unity', 'godot']),
  spriteAnimationSupported: z.boolean(),
  tilemapSupported: z.boolean(),
  performanceBenchmarkSupported: z.boolean(),
  maxSpriteSize: z.number(),
  maxTilemapSize: z.number(),
  notes: z.string().optional(),
})

export type EngineCompatibility = z.infer<typeof EngineCompatibilitySchema>

export const CompatibilityReportSchema = z.object({
  generatedAt: z.string(),
  engines: z.array(EngineCompatibilitySchema),
  overallScore: z.number(),
  recommendations: z.array(z.string()),
})

export type CompatibilityReport = z.infer<typeof CompatibilityReportSchema>

export interface CompatibilityResult {
  engine: 'phaser' | 'unity' | 'godot'
  spriteTest: SpriteAnimationTestResult
  tilemapTest: TilemapRenderTestResult
  perfTest: PerformanceBenchmarkResult
  overallPassed: boolean
  score: number
}

export function calculateCompatibilityScore(results: CompatibilityResult[]): number {
  if (results.length === 0) return 0

  const totalScore = results.reduce((sum, r) => sum + r.score, 0)
  return Math.round((totalScore / results.length) * 100) / 100
}

export function generateCompatibilityReport(
  results: CompatibilityResult[]
): CompatibilityReport {
  const overallScore = calculateCompatibilityScore(results)
  const recommendations: string[] = []

  const engineSupport = {
    phaser: { sprite: 0, tilemap: 0, perf: 0 },
    unity: { sprite: 0, tilemap: 0, perf: 0 },
    godot: { sprite: 0, tilemap: 0, perf: 0 },
  }

  for (const result of results) {
    if (result.spriteTest.passed) engineSupport[result.engine].sprite++
    if (result.tilemapTest.passed) engineSupport[result.engine].tilemap++
    if (result.perfTest.passed) engineSupport[result.engine].perf++
  }

  const engines: EngineCompatibility[] = [
    {
      engine: 'phaser',
      spriteAnimationSupported: engineSupport.phaser.sprite > 0,
      tilemapSupported: engineSupport.phaser.tilemap > 0,
      performanceBenchmarkSupported: engineSupport.phaser.perf > 0,
      maxSpriteSize: 2048,
      maxTilemapSize: 100,
    },
    {
      engine: 'unity',
      spriteAnimationSupported: engineSupport.unity.sprite > 0,
      tilemapSupported: engineSupport.unity.tilemap > 0,
      performanceBenchmarkSupported: engineSupport.unity.perf > 0,
      maxSpriteSize: 4096,
      maxTilemapSize: 200,
    },
    {
      engine: 'godot',
      spriteAnimationSupported: engineSupport.godot.sprite > 0,
      tilemapSupported: engineSupport.godot.tilemap > 0,
      performanceBenchmarkSupported: engineSupport.godot.perf > 0,
      maxSpriteSize: 2048,
      maxTilemapSize: 150,
    },
  ]

  for (const engine of ['phaser', 'unity', 'godot'] as const) {
    const support = engineSupport[engine]
    if (support.sprite === 0) {
      recommendations.push(`${engine}: No sprite animation tests passed - verify asset format compatibility`)
    }
    if (support.tilemap === 0) {
      recommendations.push(`${engine}: No tilemap tests passed - check tile mapping configuration`)
    }
    if (support.perf === 0) {
      recommendations.push(`${engine}: No performance benchmarks passed - review GPU rendering settings`)
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('All engines passed compatibility tests successfully')
  }

  return {
    generatedAt: new Date().toISOString(),
    engines,
    overallScore,
    recommendations,
  }
}

export function formatReportAsJSON(report: CompatibilityReport): string {
  return JSON.stringify(report, null, 2)
}

export function formatReportAsCSV(report: CompatibilityReport): string {
  const lines: string[] = [
    'Engine,Sprite Animation,Tilemap,Performance,Max Sprite Size,Max Tilemap Size,Notes',
  ]

  for (const engine of report.engines) {
    lines.push(
      `${engine.engine},${engine.spriteAnimationSupported},${engine.tilemapSupported},${engine.performanceBenchmarkSupported},${engine.maxSpriteSize},${engine.maxTilemapSize},${engine.notes || ''}`
    )
  }

  lines.push('')
  lines.push(`Overall Score,${report.overallScore}`)
  lines.push(`Generated,${report.generatedAt}`)
  lines.push('')
  lines.push('Recommendations')
  for (const rec of report.recommendations) {
    lines.push(rec)
  }

  return lines.join('\n')
}