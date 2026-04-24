import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ModelComparisonChart } from './ModelComparisonChart'

describe('ModelComparisonChart', () => {
  it('renders with data', () => {
    const data = [
      { model: 'Model A', averageScore: 3.2, runCount: 5 },
      { model: 'Model B', averageScore: 2.8, runCount: 3 }
    ]
    render(<ModelComparisonChart data={data} title="Model Comparison" />)
    expect(screen.getByText('Model Comparison')).toBeTruthy()
  })

  it('handles empty data', () => {
    render(<ModelComparisonChart data={[]} title="Empty" />)
    expect(screen.getByText('Empty')).toBeTruthy()
  })
})