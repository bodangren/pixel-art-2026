import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LeaderboardTable from './LeaderboardTable'
import type { LeaderboardEntry } from '@/../lib/leaderboard'

const mockEntries: LeaderboardEntry[] = [
  { model_id: 'Gemini-2.5-flash', run_count: 2, reviewed_count: 2, average_human_score: 3.6, average_tech_score: 4.5, best_human_score: 4.2, latest_run_date: '2026-04-05', total_runs: 2 },
  { model_id: 'sonnet-4.6', run_count: 1, reviewed_count: 1, average_human_score: 5.0, average_tech_score: 5.0, best_human_score: 5.0, latest_run_date: '2026-04-04', total_runs: 1 },
  { model_id: 'opus-4.6', run_count: 1, reviewed_count: 0, average_human_score: 0, average_tech_score: 3.0, best_human_score: 0, latest_run_date: '2026-04-04', total_runs: 1 },
]

describe('LeaderboardTable Component', () => {
  it('renders table headers', () => {
    render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
    expect(screen.getByText('Rank')).toBeInTheDocument()
    expect(screen.getByText('Model')).toBeInTheDocument()
    expect(screen.getByText('Tech Score')).toBeInTheDocument()
    expect(screen.getByText('Human Score')).toBeInTheDocument()
    expect(screen.getByText('Runs')).toBeInTheDocument()
  })

  it('renders model rows with correct data', () => {
    render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
    expect(screen.getAllByText('Gemini-2.5-flash')).toHaveLength(2)
    expect(screen.getAllByText('sonnet-4.6')).toHaveLength(2)
    expect(screen.getAllByText('opus-4.6')).toHaveLength(2)
  })

  it('displays rank numbers', () => {
    render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
    expect(screen.getAllByText('#1')).toHaveLength(2)
    expect(screen.getAllByText('#2')).toHaveLength(2)
    expect(screen.getAllByText('#3')).toHaveLength(2)
  })

  it('renders average scores', () => {
    render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
    expect(screen.getAllByText('4.5')).toHaveLength(2)
    expect(screen.getAllByText('3.6')).toHaveLength(2)
  })

  it('shows "?.?" for zero human scores', () => {
    render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
    const opusCards = screen.getAllByText('opus-4.6')
    const opusCard = opusCards[0].closest('[class*="rounded-2xl"]')
    expect(opusCard?.textContent).toContain('?.?')
  })

  it('calls onModelClick when row is clicked', () => {
    const handleClick = vi.fn()
    render(<LeaderboardTable entries={mockEntries} onModelClick={handleClick} />)
    const rows = screen.getAllByRole('row')
    // Row index 1 is first data row (index 0 is header)
    fireEvent.click(rows[1])
    expect(handleClick).toHaveBeenCalled()
  })

  it('handles empty state', () => {
    render(<LeaderboardTable entries={[]} onModelClick={vi.fn()} />)
    expect(screen.getByText(/Waiting for benchmark data/i)).toBeInTheDocument()
  })

  it('renders sortable column headers', () => {
    render(<LeaderboardTable entries={mockEntries} onModelClick={vi.fn()} />)
    const headers = screen.getAllByRole('columnheader')
    expect(headers.length).toBeGreaterThan(0)
  })
})