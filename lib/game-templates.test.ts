import { describe, it, expect } from 'vitest'
import {
  GameTemplate,
  TemplateGenre,
  getTemplate,
  getAllTemplates,
  listGenres
} from './game-templates'

describe('GameTemplate', () => {
  it('has required fields', () => {
    const template: GameTemplate = {
      id: 'test',
      name: 'Test Game',
      genre: 'dungeon-crawler' as TemplateGenre,
      spriteSlots: {
        hero: { type: 'character', animationRows: 3 },
        background: { type: 'terrain' }
      },
      tilemapConfig: {
        gridWidth: 10,
        gridHeight: 8,
        tileSize: 48,
        canvasWidth: 640,
        canvasHeight: 480
      },
      renderConfig: {
        scale: 2,
        backgroundColor: '#1a1a2e'
      }
    }

    expect(template.id).toBe('test')
    expect(template.name).toBe('Test Game')
    expect(template.genre).toBe('dungeon-crawler')
    expect(template.spriteSlots).toBeDefined()
    expect(template.tilemapConfig).toBeDefined()
    expect(template.renderConfig).toBeDefined()
  })

  it('spriteSlots defines hero and background for dungeon-crawler', () => {
    const template = getTemplate('labyrinth')
    expect(template.spriteSlots.hero).toBeDefined()
    expect(template.spriteSlots.background).toBeDefined()
  })

  it('tilemapConfig has correct dimensions', () => {
    const template = getTemplate('labyrinth')
    expect(template.tilemapConfig.gridWidth).toBe(13)
    expect(template.tilemapConfig.gridHeight).toBe(10)
    expect(template.tilemapConfig.tileSize).toBe(48)
    expect(template.tilemapConfig.canvasWidth).toBe(640)
    expect(template.tilemapConfig.canvasHeight).toBe(480)
  })

  it('renderConfig has scale and backgroundColor', () => {
    const template = getTemplate('labyrinth')
    expect(template.renderConfig.scale).toBe(2)
    expect(template.renderConfig.backgroundColor).toBe('#1a1a2e')
  })
})

describe('getTemplate', () => {
  it('returns labyrinth template by id', () => {
    const template = getTemplate('labyrinth')
    expect(template).toBeDefined()
    expect(template?.id).toBe('labyrinth')
  })

  it('returns undefined for unknown template', () => {
    const template = getTemplate('nonexistent')
    expect(template).toBeUndefined()
  })
})

describe('getAllTemplates', () => {
  it('returns all registered templates', () => {
    const templates = getAllTemplates()
    expect(templates.length).toBeGreaterThan(0)
    expect(templates.some(t => t.id === 'labyrinth')).toBe(true)
  })
})

describe('listGenres', () => {
  it('returns unique genre list', () => {
    const genres = listGenres()
    expect(genres).toContain('dungeon-crawler')
    expect(genres.length).toBeGreaterThan(0)
  })
})
