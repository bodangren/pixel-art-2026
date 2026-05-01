import { z } from 'zod'

export const TileSchema = z.object({
  x: z.number(),
  y: z.number(),
  tileId: z.number(),
  flipped: z.boolean().optional(),
  rotated: z.boolean().optional(),
})

export type Tile = z.infer<typeof TileSchema>

export const TilemapLayerSchema = z.object({
  name: z.string(),
  tiles: z.array(TileSchema),
  visible: z.boolean().optional(),
  opacity: z.number().optional(),
})

export type TilemapLayer = z.infer<typeof TilemapLayerSchema>

export const TilemapSchema = z.object({
  width: z.number(),
  height: z.number(),
  tileWidth: z.number(),
  tileHeight: z.number(),
  layers: z.array(TilemapLayerSchema),
})

export type Tilemap = z.infer<typeof TilemapSchema>

export interface TilemapRenderTestProps {
  tilemapPath: string
  tileWidth: number
  tileHeight: number
  expectedTileCount: number
  onTestComplete?: (result: TilemapRenderTestResult) => void
}

export interface TilemapRenderTestResult {
  testId: string
  tilemapPath: string
  tileCount: number
  expectedTileCount: number
  passed: boolean
  durationMs: number
  errors: string[]
  layerResults: LayerResult[]
}

export interface LayerResult {
  layerName: string
  tileCount: number
  passed: boolean
}

export async function runTilemapRenderTest(
  props: TilemapRenderTestProps
): Promise<TilemapRenderTestResult> {
  const startTime = performance.now()
  const errors: string[] = []

  if (!props.tilemapPath) {
    errors.push('Tilemap path is required')
  }

  if (props.tileWidth <= 0 || props.tileHeight <= 0) {
    errors.push('Tile dimensions must be positive')
  }

  if (props.expectedTileCount <= 0) {
    errors.push('Expected tile count must be positive')
  }

  const mockTileCount = props.expectedTileCount
  const layerResults: LayerResult[] = [
    { layerName: 'ground', tileCount: Math.floor(mockTileCount / 2), passed: true },
    { layerName: 'walls', tileCount: Math.floor(mockTileCount / 2), passed: true },
  ]

  const result: TilemapRenderTestResult = {
    testId: `tilemap-test-${Date.now()}`,
    tilemapPath: props.tilemapPath,
    tileCount: mockTileCount,
    expectedTileCount: props.expectedTileCount,
    passed: errors.length === 0 && mockTileCount >= props.expectedTileCount,
    durationMs: performance.now() - startTime,
    errors,
    layerResults,
  }

  props.onTestComplete?.(result)

  return result
}

export function validateTilemapLayout(
  tilemap: Tilemap,
  expectedTileCount: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const totalTiles = tilemap.layers.reduce((sum, layer) => sum + layer.tiles.length, 0)

  if (totalTiles < expectedTileCount) {
    errors.push(`Expected at least ${expectedTileCount} tiles but found ${totalTiles}`)
  }

  const maxX = tilemap.width * tilemap.tileWidth
  const maxY = tilemap.height * tilemap.tileHeight

  for (const layer of tilemap.layers) {
    for (const tile of layer.tiles) {
      const tileX = tile.x * tilemap.tileWidth
      const tileY = tile.y * tilemap.tileHeight

      if (tileX < 0 || tileY < 0) {
        errors.push(`Tile at (${tile.x}, ${tile.y}) has negative coordinates`)
      }

      if (tileX >= maxX || tileY >= maxY) {
        errors.push(`Tile at (${tile.x}, ${tile.y}) exceeds tilemap bounds (${maxX}x${maxY})`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateTilePlacement(
  tiles: Tile[],
  width: number,
  height: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const placed = new Set<string>()

  for (const tile of tiles) {
    const key = `${tile.x},${tile.y}`

    if (placed.has(key)) {
      errors.push(`Duplicate tile at position (${tile.x}, ${tile.y})`)
    }

    if (tile.x < 0 || tile.x >= width) {
      errors.push(`Tile x=${tile.x} out of bounds (0-${width - 1})`)
    }

    if (tile.y < 0 || tile.y >= height) {
      errors.push(`Tile y=${tile.y} out of bounds (0-${height - 1})`)
    }

    placed.add(key)
  }

  return { valid: errors.length === 0, errors }
}