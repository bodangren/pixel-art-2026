import { describe, it, expect, vi } from 'vitest'
import { runSpriteAnimationTest, validateSpriteSheet } from './sprite-animation-test'

describe('runSpriteAnimationTest', () => {
  it('runs test with valid parameters', async () => {
    const result = await runSpriteAnimationTest({
      assetPath: '/test/hero_sprite.png',
      expectedFrameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      fps: 12,
    })

    expect(result.testId).toBeDefined()
    expect(result.assetPath).toBe('/test/hero_sprite.png')
    expect(result.frameCount).toBe(4)
    expect(result.expectedFrameCount).toBe(4)
    expect(result.passed).toBe(true)
    expect(result.durationMs).toBeGreaterThanOrEqual(0)
  })

  it('returns error for missing asset path', async () => {
    const result = await runSpriteAnimationTest({
      assetPath: '',
      expectedFrameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('Asset path is required')
  })

  it('returns error for invalid expected frame count', async () => {
    const result = await runSpriteAnimationTest({
      assetPath: '/test/sprite.png',
      expectedFrameCount: 0,
      frameWidth: 32,
      frameHeight: 32,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('Expected frame count must be positive')
  })

  it('returns error for invalid frame dimensions', async () => {
    const result = await runSpriteAnimationTest({
      assetPath: '/test/sprite.png',
      expectedFrameCount: 4,
      frameWidth: 0,
      frameHeight: 32,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('Frame dimensions must be positive')
  })

  it('calls onTestComplete callback', async () => {
    const callback = vi.fn()
    await runSpriteAnimationTest({
      assetPath: '/test/sprite.png',
      expectedFrameCount: 4,
      frameWidth: 32,
      frameHeight: 32,
      onTestComplete: callback,
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      assetPath: '/test/sprite.png',
      passed: true,
    }))
  })
})

describe('validateSpriteSheet', () => {
  it('validates correctly sized sprite sheet', () => {
    const imageData = {
      width: 128,
      height: 64,
    } as ImageData

    const result = validateSpriteSheet(imageData, 8, 32, 32)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('detects non-evenly-divisible width', () => {
    const imageData = {
      width: 100,
      height: 64,
    } as ImageData

    const result = validateSpriteSheet(imageData, 8, 32, 32)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Image width 100 is not evenly divisible by frame width 32')
  })

  it('detects non-evenly-divisible height', () => {
    const imageData = {
      width: 128,
      height: 100,
    } as ImageData

    const result = validateSpriteSheet(imageData, 8, 32, 32)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Image height 100 is not evenly divisible by frame height 32')
  })

  it('detects insufficient frame count', () => {
    const imageData = {
      width: 64,
      height: 32,
    } as ImageData

    const result = validateSpriteSheet(imageData, 10, 32, 32)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Expected 10 frames but image only contains 2 frames')
  })
})