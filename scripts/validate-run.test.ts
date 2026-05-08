import { describe, it, expect } from 'vitest'
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

  it('should validate 32x32 resolution assets', async () => {
    const mockMetadata = async (path: string) => {
      if (path.includes('background')) return { width: 390, height: 700 }
      if (path.includes('hero')) return { width: 96, height: 96 }
      if (path.includes('goblin') || path.includes('enemy')) return { width: 96, height: 96 }
      if (path.includes('orb') || path.includes('effect')) return { width: 72, height: 24 }
      return {}
    }

    const specs32 = {
      background: { width: 390, height: 700 },
      hero: { width: 96, height: 96 },
      enemy: { width: 96, height: 96 },
      effect: { width: 72, height: 24 }
    }

    const results = await validateAssets({
      background: 'background.png',
      hero: 'hero-3x3-sheet.png',
      enemy: 'goblin-3x3-sheet.png',
      effect: 'orb-sheet.png'
    }, mockMetadata, specs32)

    expect(results.valid).toBe(true)
  })

  it('should validate 128x128 resolution assets', async () => {
    const mockMetadata = async (path: string) => {
      if (path.includes('background')) return { width: 390, height: 700 }
      if (path.includes('hero')) return { width: 384, height: 384 }
      if (path.includes('goblin') || path.includes('enemy')) return { width: 384, height: 384 }
      if (path.includes('orb') || path.includes('effect')) return { width: 288, height: 96 }
      return {}
    }

    const specs128 = {
      background: { width: 390, height: 700 },
      hero: { width: 384, height: 384 },
      enemy: { width: 384, height: 384 },
      effect: { width: 288, height: 96 }
    }

    const results = await validateAssets({
      background: 'background.png',
      hero: 'hero-3x3-sheet.png',
      enemy: 'goblin-3x3-sheet.png',
      effect: 'orb-sheet.png'
    }, mockMetadata, specs128)

    expect(results.valid).toBe(true)
  })
})
