import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendLine } from './TrendLine'

describe('TrendLine', () => {
  it('renders with data', () => {
    const data = [
      { date: '2026-04-01', score: 2.5, movingAvg: 2.5 },
      { date: '2026-04-02', score: 3.0, movingAvg: 2.75 },
      { date: '2026-04-03', score: 2.8, movingAvg: 2.77 }
    ]
    render(<TrendLine data={data} title="Quality Trend" />)
    expect(screen.getByText('Quality Trend')).toBeTruthy()
  })

  it('shows direction indicator', () => {
    const data = [
      { date: '2026-04-01', score: 2.5, movingAvg: 2.5 },
      { date: '2026-04-02', score: 3.0, movingAvg: 2.75 },
      { date: '2026-04-03', score: 3.5, movingAvg: 3.0 }
    ]
    render(<TrendLine data={data} title="Trend" direction="up" />)
    expect(screen.getByText(/↑|up/i)).toBeTruthy()
  })

  it('handles empty data', () => {
    render(<TrendLine data={[]} title="Empty" direction="stable" />)
    expect(screen.getByText('Empty')).toBeTruthy()
  })
})