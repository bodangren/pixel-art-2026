import { describe, it, expect } from 'vitest'
import { defaultDiffThresholds, getThreshold, isRegressed } from './diff-config'

describe('diff-config', () => {
  describe('defaultDiffThresholds', () => {
    it('has values between 0 and 1', () => {
      expect(defaultDiffThresholds.background).toBe(0.95)
      expect(defaultDiffThresholds.hero).toBe(0.90)
      expect(defaultDiffThresholds.enemy).toBe(0.90)
      expect(defaultDiffThresholds.effect).toBe(0.90)
    })
  })

  describe('getThreshold', () => {
    it('returns default threshold for asset type', () => {
      expect(getThreshold('background')).toBe(0.95)
      expect(getThreshold('hero')).toBe(0.90)
      expect(getThreshold('enemy')).toBe(0.90)
      expect(getThreshold('effect')).toBe(0.90)
    })

    it('returns custom threshold when provided', () => {
      const custom = { background: 0.98, hero: 0.85 }
      expect(getThreshold('background', custom)).toBe(0.98)
      expect(getThreshold('hero', custom)).toBe(0.85)
      expect(getThreshold('enemy', custom)).toBe(0.90)
    })

    it('falls back to default for unknown asset types', () => {
      const custom = { background: 0.98 }
      expect(getThreshold('effect', custom)).toBe(0.90)
    })
  })

  describe('isRegressed', () => {
    it('returns true when diff score is below threshold', () => {
      expect(isRegressed(0.80, 0.90)).toBe(true)
      expect(isRegressed(0.85, 0.95)).toBe(true)
    })

    it('returns false when diff score is at or above threshold', () => {
      expect(isRegressed(0.95, 0.90)).toBe(false)
      expect(isRegressed(1.0, 0.95)).toBe(false)
    })
  })
})