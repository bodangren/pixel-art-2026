import { describe, it, expect, vi } from 'vitest'
import { validateAssets } from './validate-run-logic'

describe('Asset Validation Logic', () => {
  it('should pass for correct dimensions', async () => {
    const mockMetadata = async (path: string) => {
      if (path.includes('background')) return { width: 390, height: 700 }
      if (path.includes('hero')) return { width: 192, height: 192 }
      if (path.includes('goblin') || path.includes('enemy')) return { width: 192, height: 192 }
      if (path.includes('orb') || path.includes('effect')) return { width: 144, height: 48 }
      return {}
    }

    const results = await validateAssets({
      background: 'background.png',
      hero: 'hero-3x3-sheet.png',
      enemy: 'goblin-3x3-sheet.png',
      effect: 'orb-sheet.png'
    }, mockMetadata)

    if (!results.valid) {
      console.log('Validation Errors:', results.errors);
    }
    expect(results.valid).toBe(true)
  })

  it('should fail for incorrect dimensions', async () => {
    const mockMetadata = async (path: string) => {
      if (path.includes('background')) return { width: 100, height: 100 }
      return { width: 192, height: 192 }
    }

    const results = await validateAssets({
      background: 'background.png',
      hero: 'hero-3x3-sheet.png',
    }, mockMetadata)

    expect(results.valid).toBe(false)
    expect(results.errors).toContain('background.png: Expected 390x700, got 100x100')
  })
})
