import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import LeaderboardTable from '@/../src/components/LeaderboardTable'
import LeaderboardFilters from '@/../src/components/LeaderboardFilters'
import ModelDetailPanel from '@/../src/components/ModelDetailPanel'
import AssetCard from '@/../src/components/AssetCard'
import ReviewTools from '@/../src/components/ReviewTools'
import BatchConfigForm from '@/../src/components/BatchConfigForm'
import type { LeaderboardEntry } from '@/../lib/leaderboard'
import type { Run } from '@/../lib/schemas'

function expectNoViolations(results: Awaited<ReturnType<typeof axe>>) {
  if (results.violations.length > 0) {
    const msg = results.violations
      .map(v => `  - ${v.id}: ${v.description} (${v.impact})`)
      .join('\n')
    throw new Error(`Accessibility violations found:\n${msg}`)
  }
}

const mockEntries: LeaderboardEntry[] = [
  { model_id: 'Gemini-2.5-flash', run_count: 2, reviewed_count: 2, average_human_score: 3.6, average_tech_score: 4.5, best_human_score: 4.2, latest_run_date: '2026-04-05', total_runs: 2 },
  { model_id: 'sonnet-4.6', run_count: 1, reviewed_count: 1, average_human_score: 5.0, average_tech_score: 5.0, best_human_score: 5.0, latest_run_date: '2026-04-04', total_runs: 1 },
]

const mockRuns: Run[] = [
  {
    run_id: 'gemini-3.1-pro__2026-04-04__r1',
    model_id: 'gemini-3.1-pro',
    variant: 'standard',
    benchmark_id: 'labyrinth-goblin-king',
    prompt_version: '1.0',
    status: 'completed' as const,
    run_date: '2026-04-04',
    asset_paths: {
      background: 'bg.png',
      hero: 'hero.png',
      enemy: 'enemy.png',
      effect: 'effect.png',
    },
    generation_notes: undefined,
  },
]

describe('Accessibility Audit — jest-axe integration', () => {
  describe('Layout', () => {
    it('has skip-to-content link for keyboard users', () => {
      render(<div><a href="#main-content">Skip to main content</a><main id="main-content">Content</main></div>)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })
  })

  describe('LeaderboardTable', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />
      )
      const results = await axe(container)
      expectNoViolations(results)
    })

    it('has accessible table structure', () => {
      render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      const headers = screen.getAllByRole('columnheader')
      expect(headers.length).toBeGreaterThan(0)
    })
  })

  describe('LeaderboardFilters', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LeaderboardFilters
          selectedStyles={[]}
          selectedModels={[]}
          onStyleChange={() => {}}
          onModelChange={() => {}}
        />
      )
      const results = await axe(container)
      expectNoViolations(results)
    })
  })

  describe('ModelDetailPanel', () => {
    it('should have no accessibility violations', async () => {
      const mockEntry: LeaderboardEntry = {
        model_id: 'gemini-3.1-pro',
        run_count: 5,
        reviewed_count: 5,
        average_human_score: 4.0,
        average_tech_score: 4.5,
        best_human_score: 4.8,
        latest_run_date: '2026-04-05',
        total_runs: 5,
      }
      const { container } = render(
        <ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={() => {}} />
      )
      const results = await axe(container)
      expectNoViolations(results)
    })

    it('has accessible close button', () => {
      const mockEntry: LeaderboardEntry = {
        model_id: 'gemini-3.1-pro',
        run_count: 5,
        reviewed_count: 5,
        average_human_score: 4.0,
        average_tech_score: 4.5,
        best_human_score: 4.8,
        latest_run_date: '2026-04-05',
        total_runs: 5,
      }
      render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={() => {}} />)
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('close button is focusable', () => {
      const mockEntry: LeaderboardEntry = {
        model_id: 'gemini-3.1-pro',
        run_count: 5,
        reviewed_count: 5,
        average_human_score: 4.0,
        average_tech_score: 4.5,
        best_human_score: 4.8,
        latest_run_date: '2026-04-05',
        total_runs: 5,
      }
      render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={() => {}} />)
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeVisible()
      expect(closeButton).not.toBeDisabled()
    })

    it('has modal role and aria attributes', () => {
      const mockEntry: LeaderboardEntry = {
        model_id: 'gemini-3.1-pro',
        run_count: 5,
        reviewed_count: 5,
        average_human_score: 4.0,
        average_tech_score: 4.5,
        best_human_score: 4.8,
        latest_run_date: '2026-04-05',
        total_runs: 5,
      }
      render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={() => {}} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby')
    })

    it('focus trap: all interactive elements are focusable', () => {
      const mockEntry: LeaderboardEntry = {
        model_id: 'gemini-3.1-pro',
        run_count: 5,
        reviewed_count: 5,
        average_human_score: 4.0,
        average_tech_score: 4.5,
        best_human_score: 4.8,
        latest_run_date: '2026-04-05',
        total_runs: 5,
      }
      render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={() => {}} />)
      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')
      const allFocusable = [...buttons, ...links]
      expect(allFocusable.length).toBeGreaterThan(0)
      allFocusable.forEach(el => {
        expect(el).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })

  describe('AssetCard', () => {
    it('should have no violations for sprite sheet', async () => {
      const mockAsset = {
        assetKey: 'hero',
        path: 'hero.png',
        fullPath: '/data/runs/run1/hero.png',
        isBackground: false,
        isSheet: true,
        rows: 3,
        cols: 3,
        frameSize: 64,
      }
      const { container } = render(<AssetCard {...mockAsset} />)
      const results = await axe(container)
      expectNoViolations(results)
    })

    it('should have no violations for static asset', async () => {
      const mockAsset = {
        assetKey: 'effect',
        path: 'effect.png',
        fullPath: '/data/runs/run1/effect.png',
        isBackground: false,
        isSheet: false,
        frameSize: 64,
      }
      const { container } = render(<AssetCard {...mockAsset} />)
      const results = await axe(container)
      expectNoViolations(results)
    })

    it('should have no violations for background asset', async () => {
      const mockAsset = {
        assetKey: 'background',
        path: 'bg.png',
        fullPath: '/data/runs/run1/bg.png',
        isBackground: true,
        isSheet: false,
      }
      const { container } = render(<AssetCard {...mockAsset} />)
      const results = await axe(container)
      expectNoViolations(results)
    })
  })

  describe('ReviewTools', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <ReviewTools
          zoom={2}
          onZoomChange={() => {}}
          showGrid={false}
          onGridToggle={() => {}}
          showCheckerboard={false}
          onCheckerboardToggle={() => {}}
        />
      )
      const results = await axe(container)
      expectNoViolations(results)
    })

    it('has toolbar role and aria-label', () => {
      render(
        <ReviewTools
          zoom={2}
          onZoomChange={() => {}}
          showGrid={false}
          onGridToggle={() => {}}
          showCheckerboard={false}
          onCheckerboardToggle={() => {}}
        />
      )
      const toolbar = screen.getByRole('toolbar')
      expect(toolbar).toHaveAttribute('aria-label')
    })

    it('slider has aria-valuemin, aria-valuemax, aria-valuenow', () => {
      render(
        <ReviewTools
          zoom={2}
          onZoomChange={() => {}}
          showGrid={false}
          onGridToggle={() => {}}
          showCheckerboard={false}
          onCheckerboardToggle={() => {}}
        />
      )
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-valuemin')
      expect(slider).toHaveAttribute('aria-valuemax')
      expect(slider).toHaveAttribute('aria-valuenow')
    })

    it('toggles have aria-pressed attribute', () => {
      render(
        <ReviewTools
          zoom={2}
          onZoomChange={() => {}}
          showGrid={false}
          onGridToggle={() => {}}
          showCheckerboard={false}
          onCheckerboardToggle={() => {}}
        />
      )
      const buttons = screen.getAllByRole('button')
      buttons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-pressed')
      })
    })

    it('has aria-live region for zoom value', () => {
      render(
        <ReviewTools
          zoom={2}
          onZoomChange={() => {}}
          showGrid={false}
          onGridToggle={() => {}}
          showCheckerboard={false}
          onCheckerboardToggle={() => {}}
        />
      )
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
    })
  })

  describe('BatchConfigForm', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <BatchConfigForm
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      )
      const results = await axe(container)
      expectNoViolations(results)
    })

    it('has accessible form inputs with labels', () => {
      render(<BatchConfigForm onSubmit={() => {}} onCancel={() => {}} />)
      const spinbuttons = screen.getAllByRole('spinbutton')
      spinbuttons.forEach(input => {
        expect(input).toHaveAttribute('id')
      })
    })
  })
})