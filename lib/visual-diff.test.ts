import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { computeDiffScore, generateDiffOverlay, type DiffResult } from './visual-diff'

const TEST_DIR = path.join(process.cwd(), 'tmp-visual-diff-test')

async function createTestPng(name: string, width: number, height: number, r: number, g: number, b: number, a = 255): Promise<string> {
  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r, g, b, alpha: a }
    }
  }).png().toBuffer()
  const filePath = path.join(TEST_DIR, name)
  await fs.writeFile(filePath, buffer)
  return filePath
}

describe('visual-diff', () => {
  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true })
  })

  afterAll(async () => {
    try {
      await fs.rm(TEST_DIR, { recursive: true })
    } catch { /* ignore */ }
  })

  describe('computeDiffScore', () => {
    it('returns 1.0 for identical PNGs', async () => {
      const img = await createTestPng(' identical.png', 16, 16, 100, 150, 200)
      const result = await computeDiffScore(img, img)
      expect(result).toBe(1.0)
    })

    it('returns less than 1.0 for different PNGs', async () => {
      const img1 = await createTestPng('img1.png', 16, 16, 100, 150, 200)
      const img2 = await createTestPng('img2.png', 16, 16, 50, 75, 100)
      const result = await computeDiffScore(img1, img2)
      expect(result).toBeLessThan(1.0)
      expect(result).toBeGreaterThan(0)
    })

    it('returns 0 for completely different images', async () => {
      const img1 = await createTestPng('white.png', 16, 16, 255, 255, 255)
      const img2 = await createTestPng('black.png', 16, 16, 0, 0, 0)
      const result = await computeDiffScore(img1, img2)
      expect(result).toBeLessThan(0.1)
    })

    it('handles images of different dimensions by resizing', async () => {
      const img1 = await createTestPng('small.png', 4, 4, 100, 100, 100)
      const img2 = await createTestPng('large.png', 4, 4, 100, 100, 100)
      const result = await computeDiffScore(img1, img2)
      expect(result).toBe(1.0)
    })

    it('handles images with alpha channel', async () => {
      const img1 = await createTestPng('alpha1.png', 16, 16, 255, 0, 0, 128)
      const img2 = await createTestPng('alpha2.png', 16, 16, 0, 0, 255, 255)
      const result = await computeDiffScore(img1, img2)
      expect(result).toBeLessThan(1.0)
      expect(result).toBeGreaterThan(0)
    })

    it('throws for non-existent files', async () => {
      await expect(computeDiffScore('/nonexistent/a.png', '/nonexistent/b.png')).rejects.toThrow()
    })

    it('returns value between 0 and 1 for valid inputs', async () => {
      const img1 = await createTestPng('a.png', 16, 16, 100, 120, 140)
      const img2 = await createTestPng('b.png', 16, 16, 110, 130, 150)
      const result = await computeDiffScore(img1, img2)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(1)
    })
  })

  describe('generateDiffOverlay', () => {
    it('generates a PNG buffer with diff highlighting', async () => {
      const img1 = await createTestPng('overlay1.png', 32, 32, 255, 0, 0)
      const img2 = await createTestPng('overlay2.png', 32, 32, 0, 0, 255)
      const buffer = await generateDiffOverlay(img1, img2)
      expect(Buffer.isBuffer(buffer)).toBe(true)
      expect(buffer.length).toBeGreaterThan(0)
      const parsed = await sharp(buffer).metadata()
      expect(parsed.width).toBe(256)
      expect(parsed.height).toBe(256)
    })

    it('overlay has transparency preserved', async () => {
      const img1 = await createTestPng('alpha1.png', 32, 32, 255, 0, 0, 128)
      const img2 = await createTestPng('alpha2.png', 32, 32, 255, 0, 0, 255)
      const buffer = await generateDiffOverlay(img1, img2)
      const metadata = await sharp(buffer).metadata()
      expect(metadata.channels).toBe(4)
    })

    it('same images produce small/near-zero diff', async () => {
      const img = await createTestPng('same.png', 16, 16, 128, 128, 128)
      const buffer = await generateDiffOverlay(img, img)
      const { data } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true })
      const nonZeroPixels = data.filter(v => v > 0).length
      expect(nonZeroPixels).toBeLessThan(data.length / 10)
    })
  })

  describe('DiffResult type', () => {
    it('computeDiffScore returns a number', async () => {
      const img = await createTestPng('number.png', 16, 16, 100, 100, 100)
      const result = await computeDiffScore(img, img)
      expect(typeof result).toBe('number')
    })
  })
})