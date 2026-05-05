import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ModelDetailPanel from './ModelDetailPanel'
import type { LeaderboardEntry } from '@/../lib/leaderboard'

const mockEntry: LeaderboardEntry = {
  model_id: 'Gemini-2.5-flash',
  run_count: 2,
  reviewed_count: 2,
  average_human_score: 3.6,
  average_tech_score: 4.5,
  best_human_score: 4.2,
  latest_run_date: '2026-04-05',
  total_runs: 2
}

const mockRuns = [
  { run_id: 'run-1', model_id: 'Gemini-2.5-flash', run_date: '2026-04-04', variant: 'initial', benchmark_id: 'labyrinth', prompt_version: '1.0', asset_paths: { background: '', hero: '', enemy: '', effect: '' }, status: 'completed' as const },
  { run_id: 'run-2', model_id: 'Gemini-2.5-flash', run_date: '2026-04-05', variant: 'r1', benchmark_id: 'labyrinth', prompt_version: '1.0', asset_paths: { background: '', hero: '', enemy: '', effect: '' }, status: 'completed' as const }
]

describe('ModelDetailPanel Component', () => {
  it('renders model name', () => {
    render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={vi.fn()} />)
    expect(screen.getByText('Gemini-2.5-flash')).toBeInTheDocument()
  })

  it('renders stats', () => {
    render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={vi.fn()} />)
    expect(screen.getByText('2')).toBeInTheDocument() // run count
    expect(screen.getByText('3.6')).toBeInTheDocument() // avg human score
  })

  it('renders run list', () => {
    render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={vi.fn()} />)
    expect(screen.getByText('run-1')).toBeInTheDocument()
    expect(screen.getByText('run-2')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(<ModelDetailPanel entry={mockEntry} runs={mockRuns} onClose={handleClose} />)
    screen.getByRole('button', { name: /close/i }).click()
    expect(handleClose).toHaveBeenCalled()
  })
})