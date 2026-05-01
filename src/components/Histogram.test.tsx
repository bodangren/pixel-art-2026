import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Histogram } from './Histogram'

describe('Histogram', () => {
  it('renders with data', () => {
    const data = [
      { bin: '1', count: 5, percentage: 25 },
      { bin: '2', count: 10, percentage: 50 },
      { bin: '3', count: 3, percentage: 15 },
      { bin: '4', count: 1, percentage: 5 },
      { bin: '5', count: 1, percentage: 5 }
    ]
    render(<Histogram data={data} title="Score Distribution" />)
    expect(screen.getByText('Score Distribution')).toBeTruthy()
  })

  it('handles empty data', () => {
    render(<Histogram data={[]} title="Empty" />)
    expect(screen.getByText('Empty')).toBeTruthy()
  })
})