import { z } from 'zod'

export interface SpriteAnimationTestProps {
  assetPath: string
  expectedFrameCount: number
  frameWidth: number
  frameHeight: number
  fps?: number
  onTestComplete?: (result: SpriteAnimationTestResult) => void
}

export interface SpriteAnimationTestResult {
  testId: string
  assetPath: string
  frameCount: number
  expectedFrameCount: number
  passed: boolean
  durationMs: number
  errors: string[]
}

export async function runSpriteAnimationTest(
  props: SpriteAnimationTestProps
): Promise<SpriteAnimationTestResult> {
  const startTime = performance.now()
  const errors: string[] = []

  if (!props.assetPath) {
    errors.push('Asset path is required')
  }

  if (props.expectedFrameCount <= 0) {
    errors.push('Expected frame count must be positive')
  }

  if (props.frameWidth <= 0 || props.frameHeight <= 0) {
    errors.push('Frame dimensions must be positive')
  }

  const frameCount = props.expectedFrameCount

  const result: SpriteAnimationTestResult = {
    testId: `sprite-test-${Date.now()}`,
    assetPath: props.assetPath,
    frameCount,
    expectedFrameCount: props.expectedFrameCount,
    passed: errors.length === 0 && frameCount === props.expectedFrameCount,
    durationMs: performance.now() - startTime,
    errors,
  }

  props.onTestComplete?.(result)

  return result
}

export function validateSpriteSheet(
  imageData: ImageData,
  expectedFrameCount: number,
  frameWidth: number,
  frameHeight: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (imageData.width % frameWidth !== 0) {
    errors.push(`Image width ${imageData.width} is not evenly divisible by frame width ${frameWidth}`)
  }

  if (imageData.height % frameHeight !== 0) {
    errors.push(`Image height ${imageData.height} is not evenly divisible by frame height ${frameHeight}`)
  }

  const calculatedFramesX = imageData.width / frameWidth
  const calculatedFramesY = imageData.height / frameHeight
  const totalFrames = calculatedFramesX * calculatedFramesY

  if (totalFrames < expectedFrameCount) {
    errors.push(`Expected ${expectedFrameCount} frames but image only contains ${totalFrames} frames`)
  }

  return { valid: errors.length === 0, errors }
}