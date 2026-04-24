import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BoxPlot } from './BoxPlot'

describe('BoxPlot', () => {
  it('renders with data', () => {
    render(
      <BoxPlot
        title="Score Quartiles"
        min={1}
        q1={2.5}
        median={3.5}
        q3={4.5}
        max={5}
      />
    )
    expect(screen.getByText('Score Quartiles')).toBeTruthy()
  })

  it('displays quartile values', () => {
    render(
      <BoxPlot
        title="Test"
        min={1}
        q1={2}
        median={3}
        q3={4}
        max={5}
      />
    )
    expect(screen.getByText(/Q1: 2/)).toBeTruthy()
    expect(screen.getByText(/Med: 3/)).toBeTruthy()
    expect(screen.getByText(/Q3: 4/)).toBeTruthy()
  })
})