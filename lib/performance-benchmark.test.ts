import { describe, it, expect, vi } from 'vitest'
import { runPerformanceBenchmark, calculateFPS, detectFrameDrops, calculateMemoryUsage } from './performance-benchmark'

describe('runPerformanceBenchmark', () => {
  it('runs benchmark with valid parameters', async () => {
    const result = await runPerformanceBenchmark({
      assetPaths: ['/test/sprite1.png', '/test/sprite2.png'],
      maxFps: 50,
      maxMemoryMB: 100,
      loadTimeMs: 500,
    })

    expect(result.testId).toBeDefined()
    expect(result.assetCount).toBe(2)
    expect(result.avgFps).toBeGreaterThan(0)
    expect(result.memoryMB).toBeGreaterThan(0)
    expect(result.loadTimeMs).toBe(500)
  })

  it('returns error for empty asset paths', async () => {
    const result = await runPerformanceBenchmark({
      assetPaths: [],
      maxFps: 50,
      maxMemoryMB: 100,
      loadTimeMs: 500,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('At least one asset path is required')
  })

  it('returns error for invalid maxFps', async () => {
    const result = await runPerformanceBenchmark({
      assetPaths: ['/test/sprite.png'],
      maxFps: 0,
      maxMemoryMB: 100,
      loadTimeMs: 500,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('maxFps must be positive')
  })

  it('returns error for invalid maxMemoryMB', async () => {
    const result = await runPerformanceBenchmark({
      assetPaths: ['/test/sprite.png'],
      maxFps: 50,
      maxMemoryMB: 0,
      loadTimeMs: 500,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('maxMemoryMB must be positive')
  })

  it('returns error for invalid loadTimeMs', async () => {
    const result = await runPerformanceBenchmark({
      assetPaths: ['/test/sprite.png'],
      maxFps: 50,
      maxMemoryMB: 100,
      loadTimeMs: 0,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('loadTimeMs must be positive')
  })

  it('calls onTestComplete callback', async () => {
    const callback = vi.fn()
    await runPerformanceBenchmark({
      assetPaths: ['/test/sprite.png'],
      maxFps: 50,
      maxMemoryMB: 100,
      loadTimeMs: 500,
      onTestComplete: callback,
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      assetCount: 1,
      passed: true,
    }))
  })
})

describe('calculateFPS', () => {
  it('calculates FPS correctly', () => {
    const fps = calculateFPS(60, 1000)
    expect(fps).toBe(60)
  })

  it('handles zero elapsed time', () => {
    const fps = calculateFPS(60, 0)
    expect(fps).toBe(Infinity)
  })

  it('calculates fractional FPS', () => {
    const fps = calculateFPS(30, 2000)
    expect(fps).toBe(15)
  })
})

describe('detectFrameDrops', () => {
  it('detects no drops in stable FPS', () => {
    const fps = [60, 60, 59, 60, 60]
    const drops = detectFrameDrops(fps)
    expect(drops).toBe(0)
  })

  it('detects frame drop', () => {
    const fps = [60, 60, 30, 60, 60]
    const drops = detectFrameDrops(fps, 0.8)
    expect(drops).toBe(1)
  })

  it('uses custom threshold', () => {
    const fps = [60, 48, 60, 60]
    const drops = detectFrameDrops(fps, 0.9)
    expect(drops).toBe(1)
  })
})

describe('calculateMemoryUsage', () => {
  it('calculates memory correctly for single asset', () => {
    const assets = [{ size: 1024 * 1024 }]
    const memory = calculateMemoryUsage(assets)
    expect(memory).toBe(1)
  })

  it('calculates memory for multiple assets', () => {
    const assets = [
      { size: 1024 * 1024 },
      { size: 2 * 1024 * 1024 },
    ]
    const memory = calculateMemoryUsage(assets)
    expect(memory).toBe(3)
  })

  it('returns zero for empty assets', () => {
    const memory = calculateMemoryUsage([])
    expect(memory).toBe(0)
  })
})