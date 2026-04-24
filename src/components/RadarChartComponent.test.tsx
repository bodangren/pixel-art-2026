import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RadarChartComponent } from './RadarChartComponent'

describe('RadarChartComponent', () => {
  it('renders with data', () => {
    const data = [
      { metric: 'Background', value: 3.5, baseline: 3.0 },
      { metric: 'Hero', value: 4.0, baseline: 3.5 },
      { metric: 'Enemy', value: 3.0, baseline: 3.0 }
    ]
    render(<RadarChartComponent data={data} title="Model A vs Baseline" />)
    expect(screen.getByText('Model A vs Baseline')).toBeTruthy()
  })

  it('handles empty data', () => {
    render(<RadarChartComponent data={[]} title="Empty" />)
    expect(screen.getByText('Empty')).toBeTruthy()
  })
})