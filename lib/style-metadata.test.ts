import { describe, it, expect } from 'vitest'
import { StyleCategory, StyleMetadataSchema, stylePresets, loadReferenceAsset, loadAllReferenceAssets } from '../lib/style-metadata'

describe('StyleCategory', () => {
  it('parses valid style categories', () => {
    expect(StyleCategory.parse('rpg')).toBe('rpg')
    expect(StyleCategory.parse('isometric')).toBe('isometric')
    expect(StyleCategory.parse('scifi')).toBe('scifi')
    expect(StyleCategory.parse('ui')).toBe('ui')
    expect(StyleCategory.parse('font')).toBe('font')
  })

  it('rejects invalid style categories', () => {
    expect(() => StyleCategory.parse('invalid')).toThrow()
    expect(() => StyleCategory.parse('')).toThrow()
  })
})

describe('StyleMetadataSchema', () => {
  it('validates correct RPG metadata', () => {
    const rpg = stylePresets.rpg
    const result = StyleMetadataSchema.safeParse(rpg)
    expect(result.success).toBe(true)
  })

  it('validates correct isometric metadata', () => {
    const isometric = stylePresets.isometric
    const result = StyleMetadataSchema.safeParse(isometric)
    expect(result.success).toBe(true)
  })

  it('rejects metadata with invalid style', () => {
    const invalid = { ...stylePresets.rpg, style: 'invalid' }
    const result = StyleMetadataSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})

describe('stylePresets', () => {
  it('has all required style categories', () => {
    const categories: StyleCategory[] = ['rpg', 'isometric', 'scifi', 'ui', 'font']
    for (const cat of categories) {
      expect(stylePresets[cat]).toBeDefined()
      expect(stylePresets[cat].style).toBe(cat)
    }
  })

  it('rpg has correct SNES-era settings', () => {
    const rpg = stylePresets.rpg
    expect(rpg.color_limit).toBe(64)
    expect(rpg.grid_alignment).toBe('3x3')
    expect(rpg.sprite_dimensions).toContainEqual([16, 16])
  })

  it('isometric has 2:1 ratio alignment', () => {
    const iso = stylePresets.isometric
    expect(iso.grid_alignment).toBe('isometric')
    expect(iso.color_limit).toBe(48)
  })

  it('scifi has neon-appropriate limits', () => {
    const scifi = stylePresets.scifi
    expect(scifi.color_limit).toBe(32)
    expect(scifi.grid_alignment).toBe('4x4')
  })

  it('ui has 8-state animation range', () => {
    const ui = stylePresets.ui
    expect(ui.animation_frames[1]).toBe(8)
    expect(ui.color_limit).toBe(16)
  })

  it('font is monochrome with single frame', () => {
    const font = stylePresets.font
    expect(font.color_limit).toBe(2)
    expect(font.animation_frames[0]).toBe(1)
    expect(font.animation_frames[1]).toBe(1)
  })
})

describe('loadReferenceAsset', () => {
  it('extracts style from path', () => {
    const asset = loadReferenceAsset('assets/references/rpg/hero.png')
    expect(asset.style).toBe('rpg')
  })

  it('throws for invalid style in path', () => {
    expect(() => loadReferenceAsset('assets/references/invalid/hero.png')).toThrow()
  })
})

describe('loadAllReferenceAssets', () => {
  it('loads one asset per style', () => {
    const assets = loadAllReferenceAssets('assets/references')
    expect(assets.length).toBe(5)
  })

  it('returns assets for all style categories', () => {
    const assets = loadAllReferenceAssets('assets/references')
    const styles = assets.map(a => a.style)
    expect(styles).toContain('rpg')
    expect(styles).toContain('isometric')
    expect(styles).toContain('scifi')
    expect(styles).toContain('ui')
    expect(styles).toContain('font')
  })
})