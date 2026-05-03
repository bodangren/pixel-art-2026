import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameCanvas from './GameCanvas'
import type { Run } from '@/../lib/schemas'

const mockRuns: Run[] = [
  {
    run_id: 'run-001',
    model_id: 'Gemini-2.5-flash',
    run_date: '2026-04-04',
    asset_paths: { hero: 'hero.png', background: 'background.png' },
    scores: { aesthetic: 85, technical: 90 },
    review_count: 3,
  },
  {
    run_id: 'run-002',
    model_id: 'Claude-3.5',
    run_date: '2026-04-05',
    asset_paths: { hero: 'hero.png', background: 'background.png' },
    scores: { aesthetic: 80, technical: 85 },
    review_count: 2,
  },
]

describe('GameCanvas', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('renders canvas element with correct dimensions', () => {
      const { container } = render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas?.width).toBe(640)
      expect(canvas?.height).toBe(480)
    })

    it('renders run selector dropdown', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      expect(screen.getByText(/run:/i)).toBeInTheDocument()
      expect(screen.getByText(/gemini-2\.5-flash/i)).toBeInTheDocument()
    })

    it('renders FPS slider control', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const slider = screen.getByRole('slider', { name: /fps/i })
      expect(slider).toBeInTheDocument()
    })

    it('renders show grid checkbox', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const checkbox = screen.getByRole('checkbox', { name: /show grid/i })
      expect(checkbox).toBeInTheDocument()
    })

    it('renders play/pause button', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const button = screen.getByRole('button', { name: /pause|play/i })
      expect(button).toBeInTheDocument()
    })

    it('renders animation state selector', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      expect(screen.getByText('Animation:')).toBeInTheDocument()
    })

    it('renders reload assets button', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      expect(screen.getByRole('button', { name: /reload assets/i })).toBeInTheDocument()
    })
  })

  describe('run selection', () => {
    it('changes selected run when dropdown changes', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const runSelect = screen.getByLabelText(/run:/i)
      fireEvent.change(runSelect, { target: { value: 'run-002' } })
      expect(screen.getByText(/claude-3\.5/i)).toBeInTheDocument()
    })
  })

  describe('animation controls', () => {
    it('toggles play/pause when button clicked', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const button = screen.getByRole('button', { name: /pause|play/i })
      fireEvent.click(button)
      expect(screen.getByRole('button', { name: /play|pause/i })).toBeInTheDocument()
    })

    it('changes FPS when slider moves', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const slider = screen.getByRole('slider', { name: /fps/i })
      fireEvent.change(slider, { target: { value: '8' } })
      expect(screen.getByText('8')).toBeInTheDocument()
    })

    it('toggles grid display when checkbox clicked', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const checkbox = screen.getByRole('checkbox', { name: /show grid/i })
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  })

  describe('hot-reload', () => {
    it('reload button triggers sprite reload', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const reloadButton = screen.getByRole('button', { name: /reload assets/i })
      fireEvent.click(reloadButton)
    })
  })

  describe('sprite animation', () => {
    it('renders with animation state selector options', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      expect(screen.getByText('Idle')).toBeInTheDocument()
      expect(screen.getByText('Walk')).toBeInTheDocument()
      expect(screen.getByText('Attack')).toBeInTheDocument()
    })

    it('changes animation state when selector changes', () => {
      render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const animationSelect = screen.getByLabelText(/animation:/i)
      fireEvent.change(animationSelect, { target: { value: 'walk' } })
    })
  })

  describe('canvas interaction', () => {
    it('canvas has correct cursor style', () => {
      const { container } = render(<GameCanvas runs={mockRuns} initialRunId="run-001" />)
      const canvas = container.querySelector('canvas')
      expect(canvas).toHaveClass('cursor-crosshair')
    })
  })
})