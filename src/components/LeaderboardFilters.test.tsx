import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LeaderboardFilters from './LeaderboardFilters'

describe('LeaderboardFilters Component', () => {
  it('renders filter inputs', () => {
    render(<LeaderboardFilters onFilterChange={vi.fn()} />)
    expect(screen.getByLabelText(/min runs/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
  })

  it('calls onFilterChange when min runs changes', () => {
    const handleChange = vi.fn()
    render(<LeaderboardFilters onFilterChange={handleChange} />)
    const input = screen.getByLabelText(/min runs/i)
    fireEvent.change(input, { target: { value: '2' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('calls onFilterChange when start date changes', () => {
    const handleChange = vi.fn()
    render(<LeaderboardFilters onFilterChange={handleChange} />)
    const input = screen.getByLabelText(/start date/i)
    fireEvent.change(input, { target: { value: '2026-04-01' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('calls onFilterChange when end date changes', () => {
    const handleChange = vi.fn()
    render(<LeaderboardFilters onFilterChange={handleChange} />)
    const input = screen.getByLabelText(/end date/i)
    fireEvent.change(input, { target: { value: '2026-04-30' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders reset button', () => {
    render(<LeaderboardFilters onFilterChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('resets filters when reset button is clicked', () => {
    const handleChange = vi.fn()
    render(<LeaderboardFilters onFilterChange={handleChange} />)
    const input = screen.getByLabelText(/min runs/i)
    fireEvent.change(input, { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(handleChange).toHaveBeenLastCalledWith({})
  })
})