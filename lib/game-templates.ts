export type TemplateGenre =
  | 'dungeon-crawler'
  | 'rpg-town'
  | 'isometric-city'
  | 'platformer-scifi'

export type SpriteSlotType = 'character' | 'terrain' | 'structure' | 'creature' | 'prop' | 'scenery'

export interface SpriteSlot {
  type: SpriteSlotType
  animationRows?: number
  defaultFrame?: number
}

export interface TilemapConfig {
  gridWidth: number
  gridHeight: number
  tileSize: number
  canvasWidth: number
  canvasHeight: number
  tiles?: Array<Array<{ x: number; y: number; slot: string; frame?: number }>>
}

export interface RenderConfig {
  scale: number
  backgroundColor: string
  projection?: 'top-down' | 'isometric'
}

export interface GameTemplate {
  id: string
  name: string
  genre: TemplateGenre
  spriteSlots: Record<string, SpriteSlot>
  tilemapConfig: TilemapConfig
  renderConfig: RenderConfig
}

const templates: Record<string, GameTemplate> = {
  labyrinth: {
    id: 'labyrinth',
    name: 'Labyrinth of the Goblin King',
    genre: 'dungeon-crawler',
    spriteSlots: {
      hero: { type: 'character', animationRows: 3 },
      background: { type: 'terrain' }
    },
    tilemapConfig: {
      gridWidth: 13,
      gridHeight: 10,
      tileSize: 48,
      canvasWidth: 640,
      canvasHeight: 480,
      tiles: [
        [{ x: 0, y: 0, slot: 'background' }, { x: 1, y: 0, slot: 'background' }],
        [{ x: 0, y: 1, slot: 'background' }, { x: 1, y: 1, slot: 'background' }]
      ]
    },
    renderConfig: {
      scale: 2,
      backgroundColor: '#1a1a2e'
    }
  },
  'rpg-town': {
    id: 'rpg-town',
    name: 'RPG Town',
    genre: 'rpg-town',
    spriteSlots: {
      hero: { type: 'character', animationRows: 3 },
      npc: { type: 'character', animationRows: 3 },
      building: { type: 'structure' },
      tree: { type: 'scenery' }
    },
    tilemapConfig: {
      gridWidth: 16,
      gridHeight: 12,
      tileSize: 48,
      canvasWidth: 768,
      canvasHeight: 576,
      tiles: []
    },
    renderConfig: {
      scale: 2,
      backgroundColor: '#2d5a27'
    }
  },
  'isometric-city': {
    id: 'isometric-city',
    name: 'Isometric City',
    genre: 'isometric-city',
    spriteSlots: {
      building: { type: 'structure' },
      ground: { type: 'terrain' },
      vehicle: { type: 'prop' },
      tree: { type: 'scenery' }
    },
    tilemapConfig: {
      gridWidth: 12,
      gridHeight: 10,
      tileSize: 48,
      canvasWidth: 640,
      canvasHeight: 480,
      tiles: []
    },
    renderConfig: {
      scale: 2,
      backgroundColor: '#3a3a5c',
      projection: 'isometric'
    }
  },
  'scifi-platformer': {
    id: 'scifi-platformer',
    name: 'Sci-Fi Platformer',
    genre: 'platformer-scifi',
    spriteSlots: {
      hero: { type: 'character', animationRows: 3 },
      enemy: { type: 'creature' },
      platform: { type: 'terrain' },
      background: { type: 'scenery' }
    },
    tilemapConfig: {
      gridWidth: 20,
      gridHeight: 15,
      tileSize: 48,
      canvasWidth: 960,
      canvasHeight: 720,
      tiles: []
    },
    renderConfig: {
      scale: 2,
      backgroundColor: '#0a0a1a'
    }
  }
}

export function getTemplate(id: string): GameTemplate | undefined {
  return templates[id]
}

export function getAllTemplates(): GameTemplate[] {
  return Object.values(templates)
}

export function listGenres(): TemplateGenre[] {
  const genres = new Set(getAllTemplates().map(t => t.genre))
  return Array.from(genres)
}
