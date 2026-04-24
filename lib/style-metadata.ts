import { z } from 'zod'

export const StyleCategory = z.enum(['rpg', 'isometric', 'scifi', 'ui', 'font'])
export type StyleCategory = z.infer<typeof StyleCategory>

export const StyleMetadataSchema = z.object({
  style: StyleCategory,
  name: z.string(),
  description: z.string(),
  sprite_dimensions: z.array(z.tuple([z.number(), z.number()])),
  color_limit: z.number(),
  animation_frames: z.tuple([z.number(), z.number()]),
  grid_alignment: z.enum(['none', '2x2', '3x3', '4x4', 'isometric']),
  palette_notes: z.string().optional()
})

export type StyleMetadata = z.infer<typeof StyleMetadataSchema>

export const stylePresets: Record<StyleCategory, StyleMetadata> = {
  rpg: {
    style: 'rpg',
    name: '16-bit RPG',
    description: 'SNES-era fantasy RPG style with limited color palettes',
    sprite_dimensions: [[16, 16], [32, 32], [64, 64]],
    color_limit: 64,
    animation_frames: [4, 8],
    grid_alignment: '3x3'
  },
  isometric: {
    style: 'isometric',
    name: 'Isometric',
    description: '2:1 pixel ratio with 45-degree angles',
    sprite_dimensions: [[32, 16], [64, 32], [128, 64]],
    color_limit: 48,
    animation_frames: [2, 4],
    grid_alignment: 'isometric'
  },
  scifi: {
    style: 'scifi',
    name: 'Top-down Sci-fi',
    description: 'Neon palette with tech motifs',
    sprite_dimensions: [[16, 16], [24, 24], [32, 32]],
    color_limit: 32,
    animation_frames: [2, 6],
    grid_alignment: '4x4'
  },
  ui: {
    style: 'ui',
    name: 'UI Buttons',
    description: '8-state button sprites with consistent borders',
    sprite_dimensions: [[16, 16], [24, 24], [32, 8]],
    color_limit: 16,
    animation_frames: [4, 8],
    grid_alignment: 'none'
  },
  font: {
    style: 'font',
    name: 'Font Sheets',
    description: 'Monospace character grids',
    sprite_dimensions: [[128, 16], [256, 32]],
    color_limit: 2,
    animation_frames: [1, 1],
    grid_alignment: 'none'
  }
}

export class ReferenceAsset {
  constructor(
    public readonly path: string,
    public readonly style: StyleCategory,
    public readonly dimensions: [number, number],
    public readonly colorCount: number,
    public readonly animationFrameCount: number
  ) {}

  toMetadata(): StyleMetadata {
    return stylePresets[this.style]
  }
}

export function loadReferenceAsset(path: string): ReferenceAsset {
  const parts = path.split('/')
  const styleDir = parts[parts.length - 2]
  const style = StyleCategory.parse(styleDir)

  return new ReferenceAsset(path, style, [16, 16], 8, 1)
}

export function loadAllReferenceAssets(dir: string): ReferenceAsset[] {
  const assets: ReferenceAsset[] = []
  const styles: StyleCategory[] = ['rpg', 'isometric', 'scifi', 'ui', 'font']

  for (const style of styles) {
    const styleDir = `${dir}/${style}`
    assets.push(new ReferenceAsset(`${styleDir}/placeholder.png`, style, [16, 16], 8, 1))
  }

  return assets
}