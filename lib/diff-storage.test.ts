import { describe, it, expect } from 'vitest'
import { hasRegressed } from './diff-storage'
import { defaultDiffThresholds } from './diff-config'

describe('diff-storage', () => {
  describe('hasRegressed', () => {
    it('returns true when regressed flag is set', () => {
      const result = { regressed: true, diff_scores: { background: 0.8, hero: 0.9, enemy: 0.9, effect: 0.9 } }
      expect(hasRegressed(result)).toBe(true)
    })

    it('returns false when regressed flag is not set', () => {
      const result = { regressed: false, diff_scores: { background: 0.98, hero: 0.95, enemy: 0.92, effect: 0.91 } }
      expect(hasRegressed(result)).toBe(false)
    })
  })

  describe('diff score thresholds', () => {
    it('background threshold is 0.95', () => {
      expect(defaultDiffThresholds.background).toBe(0.95)
    })

    it('sprite thresholds are 0.90', () => {
      expect(defaultDiffThresholds.hero).toBe(0.90)
      expect(defaultDiffThresholds.enemy).toBe(0.90)
      expect(defaultDiffThresholds.effect).toBe(0.90)
    })
  })
})