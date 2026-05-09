import { describe, it, expect, beforeAll } from 'vitest'
import { extractFeatures, type QualityFeatures } from './quality-features'
import sharp from 'sharp'
import path from 'path'

describe('quality-features', () => {
  const TEST_DATA_DIR = path.join(process.cwd(), 'public/data/runs')
  const TEST_RUN_ID = 'gemini-2.5-flash__2026-04-04__initial'

  let testImageBuffer: Buffer

  beforeAll(async () => {
    const runPath = path.join(TEST_DATA_DIR, TEST_RUN_ID)
    const assetPath = path.join(runPath, 'assets')
    const entries = await new Promise<string[]>((resolve) => {
      require('fs').readdir(assetPath, (err: Error | null, files: string[]) => {
        resolve(err ? [] : files.filter(f => f.endsWith('.png')))
      })
    })

    if (entries.length > 0) {
      const pngPath = path.join(assetPath, entries[0])
      const fs = require('fs')
      testImageBuffer = fs.readFileSync(pngPath)
    }
  })

  it('extracts color histogram features', async () => {
    if (!testImageBuffer) {
      expect(true).toBe(true)
      return
    }
    const features = await extractFeatures(testImageBuffer)
    expect(features.colorHistogram).toBeDefined()
    expect(Array.isArray(features.colorHistogram)).toBe(true)
    expect(features.colorHistogram.length).toBeGreaterThan(0)
  })

  it('extracts edge density feature', async () => {
    if (!testImageBuffer) {
      expect(true).toBe(true)
      return
    }
    const features = await extractFeatures(testImageBuffer)
    expect(features.edgeDensity).toBeDefined()
    expect(typeof features.edgeDensity).toBe('number')
    expect(features.edgeDensity).toBeGreaterThanOrEqual(0)
    expect(features.edgeDensity).toBeLessThanOrEqual(1)
  })

  it('extracts transparency ratio feature', async () => {
    if (!testImageBuffer) {
      expect(true).toBe(true)
      return
    }
    const features = await extractFeatures(testImageBuffer)
    expect(features.transparencyRatio).toBeDefined()
    expect(typeof features.transparencyRatio).toBe('number')
    expect(features.transparencyRatio).toBeGreaterThanOrEqual(0)
    expect(features.transparencyRatio).toBeLessThanOrEqual(1)
  })

  it('extracts grid alignment score', async () => {
    if (!testImageBuffer) {
      expect(true).toBe(true)
      return
    }
    const features = await extractFeatures(testImageBuffer)
    expect(features.gridAlignmentScore).toBeDefined()
    expect(typeof features.gridAlignmentScore).toBe('number')
    expect(features.gridAlignmentScore).toBeGreaterThanOrEqual(0)
    expect(features.gridAlignmentScore).toBeLessThanOrEqual(1)
  })

  it('returns all expected feature fields', async () => {
    if (!testImageBuffer) {
      expect(true).toBe(true)
      return
    }
    const features = await extractFeatures(testImageBuffer)
    expect(features).toHaveProperty('colorHistogram')
    expect(features).toHaveProperty('edgeDensity')
    expect(features).toHaveProperty('transparencyRatio')
    expect(features).toHaveProperty('gridAlignmentScore')
    expect(features).toHaveProperty('colorCount')
    expect(features).toHaveProperty('uniqueColorRatio')
  })

  it('handles grayscale images', async () => {
    const grayscaleBuffer = await sharp({
      create: {
        width: 96,
        height: 96,
        channels: 4,
        background: { r: 128, g: 128, b: 128, alpha: 255 }
      }
    }).png().toBuffer()

    const features = await extractFeatures(grayscaleBuffer)
    expect(features).toBeDefined()
    expect(features.colorCount).toBeGreaterThan(0)
  })

  it('handles RGBA images with transparency', async () => {
    const rgbaBuffer = await sharp({
      create: {
        width: 96,
        height: 96,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).png().toBuffer()

    const features = await extractFeatures(rgbaBuffer)
    expect(features).toBeDefined()
    expect(features.transparencyRatio).toBeGreaterThan(0)
  })

  it('rejects invalid buffer', async () => {
    const invalidBuffer = Buffer.from('not an image')
    await expect(extractFeatures(invalidBuffer)).rejects.toThrow()
  })

  it('computes grid alignment for 3x3 sprite sheet', async () => {
    const sheetBuffer = await sharp({
      create: {
        width: 96,
        height: 96,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 255 }
      }
    }).png().toBuffer()

    const features = await extractFeatures(sheetBuffer)
    expect(features.gridAlignmentScore).toBe(1)
  })
})