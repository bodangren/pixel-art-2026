import { describe, it, expect, vi } from 'vitest'
import { runTilemapRenderTest, validateTilemapLayout, validateTilePlacement, type Tilemap } from './tilemap-render-test'

describe('runTilemapRenderTest', () => {
  it('runs test with valid parameters', async () => {
    const result = await runTilemapRenderTest({
      tilemapPath: '/test/map.json',
      tileWidth: 32,
      tileHeight: 32,
      expectedTileCount: 100,
    })

    expect(result.testId).toBeDefined()
    expect(result.tilemapPath).toBe('/test/map.json')
    expect(result.tileCount).toBe(100)
    expect(result.expectedTileCount).toBe(100)
    expect(result.passed).toBe(true)
    expect(result.layerResults).toHaveLength(2)
  })

  it('returns error for missing tilemap path', async () => {
    const result = await runTilemapRenderTest({
      tilemapPath: '',
      tileWidth: 32,
      tileHeight: 32,
      expectedTileCount: 100,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('Tilemap path is required')
  })

  it('returns error for invalid tile dimensions', async () => {
    const result = await runTilemapRenderTest({
      tilemapPath: '/test/map.json',
      tileWidth: 0,
      tileHeight: 32,
      expectedTileCount: 100,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('Tile dimensions must be positive')
  })

  it('returns error for invalid expected tile count', async () => {
    const result = await runTilemapRenderTest({
      tilemapPath: '/test/map.json',
      tileWidth: 32,
      tileHeight: 32,
      expectedTileCount: 0,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toContain('Expected tile count must be positive')
  })

  it('calls onTestComplete callback', async () => {
    const callback = vi.fn()
    await runTilemapRenderTest({
      tilemapPath: '/test/map.json',
      tileWidth: 32,
      tileHeight: 32,
      expectedTileCount: 100,
      onTestComplete: callback,
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      tilemapPath: '/test/map.json',
      passed: true,
    }))
  })
})

describe('validateTilemapLayout', () => {
  it('validates correctly structured tilemap', () => {
    const tilemap: Tilemap = {
      width: 10,
      height: 10,
      tileWidth: 32,
      tileHeight: 32,
      layers: [
        {
          name: 'ground',
          tiles: [
            { x: 0, y: 0, tileId: 1 },
            { x: 1, y: 0, tileId: 2 },
          ],
        },
      ],
    }

    const result = validateTilemapLayout(tilemap, 2)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('detects insufficient tile count', () => {
    const tilemap: Tilemap = {
      width: 10,
      height: 10,
      tileWidth: 32,
      tileHeight: 32,
      layers: [
        {
          name: 'ground',
          tiles: [{ x: 0, y: 0, tileId: 1 }],
        },
      ],
    }

    const result = validateTilemapLayout(tilemap, 10)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Expected at least 10 tiles but found 1')
  })

  it('detects negative tile coordinates', () => {
    const tilemap: Tilemap = {
      width: 10,
      height: 10,
      tileWidth: 32,
      tileHeight: 32,
      layers: [
        {
          name: 'ground',
          tiles: [{ x: -1, y: 0, tileId: 1 }],
        },
      ],
    }

    const result = validateTilemapLayout(tilemap, 1)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tile at (-1, 0) has negative coordinates')
  })

  it('detects out-of-bounds tiles', () => {
    const tilemap: Tilemap = {
      width: 10,
      height: 10,
      tileWidth: 32,
      tileHeight: 32,
      layers: [
        {
          name: 'ground',
          tiles: [{ x: 15, y: 0, tileId: 1 }],
        },
      ],
    }

    const result = validateTilemapLayout(tilemap, 1)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('exceeds tilemap bounds'))).toBe(true)
  })
})

describe('validateTilePlacement', () => {
  it('validates correct tile placement', () => {
    const tiles = [
      { x: 0, y: 0, tileId: 1 },
      { x: 1, y: 0, tileId: 2 },
      { x: 0, y: 1, tileId: 3 },
    ]

    const result = validateTilePlacement(tiles, 10, 10)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('detects duplicate tiles', () => {
    const tiles = [
      { x: 0, y: 0, tileId: 1 },
      { x: 0, y: 0, tileId: 2 },
    ]

    const result = validateTilePlacement(tiles, 10, 10)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Duplicate tile at position (0, 0)')
  })

  it('detects out-of-bounds x coordinate', () => {
    const tiles = [{ x: 15, y: 0, tileId: 1 }]

    const result = validateTilePlacement(tiles, 10, 10)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tile x=15 out of bounds (0-9)')
  })

  it('detects out-of-bounds y coordinate', () => {
    const tiles = [{ x: 0, y: 15, tileId: 1 }]

    const result = validateTilePlacement(tiles, 10, 10)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tile y=15 out of bounds (0-9)')
  })
})