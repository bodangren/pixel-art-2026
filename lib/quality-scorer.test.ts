import { describe, it, expect, beforeAll } from 'vitest'
import { scoreAsset, isLikelyFailure, scoreBatch, type QualityScore } from './quality-scorer'
import sharp from 'sharp'
import path from 'path'

describe('quality-scorer', () => {
  let testBuffer: Buffer

  beforeAll(async () => {
    testBuffer = await sharp({
      create: {
        width: 96,
        height: 96,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 255 }
      }
    }).png().toBuffer()
  })

  describe('scoreAsset', () => {
    it('returns a valid quality score object', async () => {
      const result = await scoreAsset(testBuffer)
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('confidence')
      expect(result).toHaveProperty('features')
      expect(result).toHaveProperty('modelVersion')
    })

    it('score is between 0 and 100', async () => {
      const result = await scoreAsset(testBuffer)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('confidence is high, medium, or low', async () => {
      const result = await scoreAsset(testBuffer)
      expect(['high', 'medium', 'low']).toContain(result.confidence)
    })

    it('handles transparent images', async () => {
      const transparentBuffer = await sharp({
        create: {
          width: 96,
          height: 96,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      }).png().toBuffer()

      const result = await scoreAsset(transparentBuffer)
      expect(result.features.transparencyRatio).toBeGreaterThan(0)
    })
  })

  describe('isLikelyFailure', () => {
    it('returns true for score < 40', async () => {
      const lowScore = { score: 35, confidence: 'low' as const, features: {} as any, modelVersion: '1.0.0' }
      expect(isLikelyFailure(lowScore)).toBe(true)
    })

    it('returns false for score >= 40', async () => {
      const passingScore = { score: 45, confidence: 'medium' as const, features: {} as any, modelVersion: '1.0.0' }
      expect(isLikelyFailure(passingScore)).toBe(false)
    })

    it('returns false for score == 40', async () => {
      const borderlineScore = { score: 40, confidence: 'medium' as const, features: {} as any, modelVersion: '1.0.0' }
      expect(isLikelyFailure(borderlineScore)).toBe(false)
    })
  })

  describe('scoreBatch', () => {
    it('scores multiple assets', async () => {
      const buffers = [testBuffer, testBuffer]
      const result = await scoreBatch(buffers)
      expect(result.scores).toHaveLength(2)
      expect(result.meanScore).toBeGreaterThanOrEqual(0)
    })

    it('counts likely failures', async () => {
      const buffers = [testBuffer, testBuffer]
      const result = await scoreBatch(buffers)
      expect(typeof result.likelyFailures).toBe('number')
      expect(result.likelyFailures).toBeGreaterThanOrEqual(0)
    })

    it('handles empty batch', async () => {
      const result = await scoreBatch([])
      expect(result.scores).toHaveLength(0)
      expect(result.meanScore).toBe(0)
      expect(result.likelyFailures).toBe(0)
    })
  })
})