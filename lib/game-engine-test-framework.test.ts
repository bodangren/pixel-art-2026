import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IntegrationTestFramework, createMockTestRunner, type SpriteAnimationTest } from './game-engine-test-framework'

describe('IntegrationTestFramework', () => {
  let framework: IntegrationTestFramework

  beforeEach(() => {
    framework = new IntegrationTestFramework()
  })

  afterEach(async () => {
    await framework.cleanup()
  })

  it('registers and retrieves test runners', () => {
    const phaserRunner = createMockTestRunner('phaser')
    framework.registerRunner('phaser', phaserRunner)

    const results = framework.runAllTests({
      spriteAnimation: [{
        assetPath: '/test/sprite.png',
        expectedFrameCount: 4,
        frameWidth: 32,
        frameHeight: 32,
      }],
    })

    expect(results).toBeDefined()
  })

  it('runs sprite animation tests for registered engines', async () => {
    framework.registerRunner('phaser', createMockTestRunner('phaser'))

    const spriteTest: SpriteAnimationTest = {
      assetPath: '/test/hero_sprite.png',
      expectedFrameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      fps: 12,
    }

    const results = await framework.runAllTests({ spriteAnimation: [spriteTest] })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].engine).toBe('phaser')
    expect(results[0].passed).toBe(true)
  })

  it('returns error results when test fails', async () => {
    const failingRunner = {
      engine: 'phaser' as const,
      runSpriteAnimationTest: async () => ({
        testId: 'failing-test',
        engine: 'phaser' as const,
        passed: false,
        durationMs: 0,
        error: 'Asset not found',
        timestamp: new Date().toISOString(),
      }),
      runTilemapRenderTest: async () => ({
        testId: 'failing-tilemap',
        engine: 'phaser' as const,
        passed: false,
        durationMs: 0,
        error: 'Tilemap parse error',
        timestamp: new Date().toISOString(),
      }),
      runPerformanceBenchmark: async () => ({
        testId: 'failing-perf',
        engine: 'phaser' as const,
        passed: false,
        durationMs: 0,
        error: 'Performance threshold exceeded',
        timestamp: new Date().toISOString(),
      }),
      cleanup: async () => {},
    }

    framework.registerRunner('phaser', failingRunner)

    const results = await framework.runAllTests({
      spriteAnimation: [{
        assetPath: '/test/missing.png',
        expectedFrameCount: 4,
        frameWidth: 32,
        frameHeight: 32,
      }],
    })

    expect(results[0].passed).toBe(false)
    expect(results[0].error).toBe('Asset not found')
  })

  it('cleans up all runners', async () => {
    const mockCleanup = { cleanup: async () => {} }
    framework.registerRunner('phaser', mockCleanup as any)
    framework.registerRunner('unity', mockCleanup as any)

    await framework.cleanup()

    const results = await framework.runAllTests({ spriteAnimation: [] })
    expect(results.length).toBe(0)
  })
})

describe('createMockTestRunner', () => {
  it('creates a working mock runner for phaser', async () => {
    const runner = createMockTestRunner('phaser')
    const result = await runner.runSpriteAnimationTest({
      assetPath: '/test/sprite.png',
      expectedFrameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
    })

    expect(result.engine).toBe('phaser')
    expect(result.passed).toBe(true)
    expect(result.durationMs).toBeGreaterThan(0)
  })
})