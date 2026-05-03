import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ExportDropdown from './ExportDropdown'
import type { LeaderboardEntry } from '@/../lib/leaderboard'

describe('ExportDropdown', () => {
  const mockEntries: LeaderboardEntry[] = [
    { model_id: 'Model A', run_count: 5, reviewed_count: 3, average_human_score: 4.2, average_tech_score: 4.5, best_human_score: 4.8, latest_run_date: '2026-05-01', total_runs: 5 },
    { model_id: 'Model B', run_count: 3, reviewed_count: 2, average_human_score: 3.8, average_tech_score: 4.0, best_human_score: 4.1, latest_run_date: '2026-04-28', total_runs: 3 }
  ]

  it('renders export button', () => {
    render(<ExportDropdown entries={mockEntries} />)
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('shows dropdown menu when clicked', () => {
    render(<ExportDropdown entries={mockEntries} />)
    fireEvent.click(screen.getByRole('button', { name: /export/i }))
    expect(screen.getByText('CSV')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
  })

  it('closes dropdown after CSV export', () => {
    const { container } = render(<ExportDropdown entries={mockEntries} />)
    fireEvent.click(screen.getByRole('button', { name: /export/i }))
    const csvButton = screen.getByText('CSV').closest('button')
    fireEvent.click(csvButton!)
    expect(container.querySelector('[aria-expanded="true"]')).not.toBeInTheDocument()
  })

  it('closes dropdown after JSON export', () => {
    const { container } = render(<ExportDropdown entries={mockEntries} />)
    fireEvent.click(screen.getByRole('button', { name: /export/i }))
    const jsonButton = screen.getByText('JSON').closest('button')
    fireEvent.click(jsonButton!)
    expect(container.querySelector('[aria-expanded="true"]')).not.toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<ExportDropdown entries={mockEntries} label="Download Data" />)
    expect(screen.getByRole('button', { name: /download data/i })).toBeInTheDocument()
  })

  it('has accessible button with aria-haspopup', () => {
    render(<ExportDropdown entries={mockEntries} />)
    const button = screen.getByRole('button', { name: /export/i })
    expect(button).toHaveAttribute('aria-haspopup', 'true')
  })
})