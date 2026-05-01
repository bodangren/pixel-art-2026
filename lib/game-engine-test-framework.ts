import { z } from 'zod'

export const IntegrationTestResultSchema = z.object({
  testId: z.string(),
  engine: z.enum(['phaser', 'unity', 'godot']),
  passed: z.boolean(),
  durationMs: z.number(),
  screenshotPath: z.string().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
})

export type IntegrationTestResult = z.infer<typeof IntegrationTestResultSchema>

export const SpriteAnimationTestSchema = z.object({
  assetPath: z.string(),
  expectedFrameCount: z.number(),
  frameWidth: z.number(),
  frameHeight: z.number(),
  fps: z.number().optional(),
})

export type SpriteAnimationTest = z.infer<typeof SpriteAnimationTestSchema>

export const TilemapRenderTestSchema = z.object({
  tilemapPath: z.string(),
  tileWidth: z.number(),
  tileHeight: z.number(),
  expectedTileCount: z.number(),
})

export type TilemapRenderTest = z.infer<typeof TilemapRenderTestSchema>

export const PerformanceBenchmarkSchema = z.object({
  assetPaths: z.array(z.string()),
  maxFps: z.number(),
  maxMemoryMB: z.number(),
  loadTimeMs: z.number(),
})

export type PerformanceBenchmark = z.infer<typeof PerformanceBenchmarkSchema>

export interface GameEngineTestRunner {
  engine: 'phaser' | 'unity' | 'godot'
  runSpriteAnimationTest(test: SpriteAnimationTest): Promise<IntegrationTestResult>
  runTilemapRenderTest(test: TilemapRenderTest): Promise<IntegrationTestResult>
  runPerformanceBenchmark(benchmark: PerformanceBenchmark): Promise<IntegrationTestResult>
  cleanup(): Promise<void>
}

export class IntegrationTestFramework {
  private runners: Map<string, GameEngineTestRunner> = new Map()

  registerRunner(engine: 'phaser' | 'unity' | 'godot', runner: GameEngineTestRunner): void {
    this.runners.set(engine, runner)
  }

  async runAllTests(tests: {
    spriteAnimation?: SpriteAnimationTest[]
    tilemap?: TilemapRenderTest[]
    performance?: PerformanceBenchmark[]
  }): Promise<IntegrationTestResult[]> {
    const results: IntegrationTestResult[] = []

    for (const [engine, runner] of this.runners) {
      if (tests.spriteAnimation) {
        for (const test of tests.spriteAnimation) {
          try {
            const result = await runner.runSpriteAnimationTest(test)
            results.push(result)
          } catch (error) {
            results.push({
              testId: `error-${engine}-${Date.now()}`,
              engine: engine as 'phaser' | 'unity' | 'godot',
              passed: false,
              durationMs: 0,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString(),
            })
          }
        }
      }
    }

    return results
  }

  async cleanup(): Promise<void> {
    for (const runner of this.runners.values()) {
      await runner.cleanup()
    }
    this.runners.clear()
  }
}

export function createMockTestRunner(engine: 'phaser' | 'unity' | 'godot'): GameEngineTestRunner {
  return {
    engine,
    runSpriteAnimationTest: async (test) => ({
      testId: `sprite-${test.assetPath}-${Date.now()}`,
      engine,
      passed: true,
      durationMs: Math.random() * 100 + 50,
      timestamp: new Date().toISOString(),
    }),
    runTilemapRenderTest: async (test) => ({
      testId: `tilemap-${test.tilemapPath}-${Date.now()}`,
      engine,
      passed: true,
      durationMs: Math.random() * 100 + 50,
      timestamp: new Date().toISOString(),
    }),
    runPerformanceBenchmark: async () => ({
      testId: `perf-${Date.now()}`,
      engine,
      passed: true,
      durationMs: Math.random() * 500 + 100,
      timestamp: new Date().toISOString(),
    }),
    cleanup: async () => {},
  }
}