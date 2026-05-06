import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAssetPackMetadata, getAssetPackSize } from './asset-pack'
import fs from 'fs/promises'

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn(),
  }
}))

describe('asset-pack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAssetPackMetadata', () => {
    it('returns metadata for valid run', async () => {
      const mockRun = {
        run_id: 'test-run-001',
        model_id: 'Test-Model',
        run_date: '2026-05-01',
        variant: 'initial',
        benchmark_game_id: 'labyrinth-of-the-goblin-king',
        asset_file_paths: {},
        status: 'completed' as const,
        technical_grade: { total_technical_score: 4.5 }
      }

      const mockReview = {
        review_timestamp: '2026-05-02T00:00:00Z',
        rubric_scores: { background: 4, hero: 5, enemy: 4, effect: 4, pack: 4 },
        notes: 'Good sprites',
        weighted_total_score: 4.2,
        would_use_in_prototype_now: true
      }

      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRun))
      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockReview))
      vi.mocked(fs.readdir).mockResolvedValue(['background.png', 'hero-sheet.png'] as any)

      const result = await getAssetPackMetadata('test-run-001')

      expect(result).toMatchObject({
        modelId: 'Test-Model',
        runId: 'test-run-001',
        runDate: '2026-05-01',
        variant: 'initial',
        benchmarkGameId: 'labyrinth-of-the-goblin-king',
        humanScore: 4.2,
        techScore: 4.5,
        assetCount: 2
      })
    })

    it('returns null for non-existent run', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'))

      const result = await getAssetPackMetadata('non-existent')

      expect(result).toBeNull()
    })

    it('handles missing review gracefully', async () => {
      const mockRun = {
        run_id: 'test-run-002',
        model_id: 'Test-Model',
        run_date: '2026-05-01',
        variant: 'initial',
        benchmark_game_id: 'labyrinth',
        asset_file_paths: {},
        status: 'completed' as const,
        technical_grade: { total_technical_score: 5.0 }
      }

      vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(mockRun))
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'))
      vi.mocked(fs.readdir).mockResolvedValue(['sprite.png'] as any)

      const result = await getAssetPackMetadata('test-run-002')

      expect(result).toMatchObject({
        modelId: 'Test-Model',
        humanScore: undefined,
        techScore: 5.0,
        assetCount: 1
      })
    })
  })

  describe('getAssetPackSize', () => {
    it('returns count and estimated size', async () => {
      vi.mocked(fs.readdir).mockResolvedValue(['a.png', 'b.png', 'c.png'] as any)
      vi.mocked(fs.stat).mockImplementation(async () => ({ size: 1024 }) as any)

      const result = await getAssetPackSize('test-run')

      expect(result.count).toBe(3)
      expect(result.estimatedMB).toBeGreaterThan(0)
    })

    it('returns zeros for non-existent run', async () => {
      vi.mocked(fs.readdir).mockRejectedValue(new Error('ENOENT'))

      const result = await getAssetPackSize('non-existent')

      expect(result).toEqual({ count: 0, estimatedMB: 0 })
    })
  })
})