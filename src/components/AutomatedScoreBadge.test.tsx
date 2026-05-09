import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AutomatedScoreBadge from './AutomatedScoreBadge'

describe('AutomatedScoreBadge', () => {
  it('renders score value', () => {
    render(<AutomatedScoreBadge score={75.5} confidence="high" />)
    expect(screen.getByText('75.5')).toBeTruthy()
  })

  it('applies green classes for high scores', () => {
    const { container } = render(<AutomatedScoreBadge score={85} confidence="high" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-green-500/20')
  })

  it('applies yellow classes for medium scores', () => {
    const { container } = render(<AutomatedScoreBadge score={55} confidence="medium" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-yellow-500/20')
  })

  it('applies red classes for low scores', () => {
    const { container } = render(<AutomatedScoreBadge score={35} confidence="low" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-red-500/20')
  })

  it('applies red color for scores below 40', () => {
    const { container } = render(<AutomatedScoreBadge score={35} confidence="low" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-red-500/20')
  })

  it('applies yellow color for scores 40-70', () => {
    const { container } = render(<AutomatedScoreBadge score={55} confidence="medium" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-yellow-500/20')
  })

  it('applies green color for scores 70+', () => {
    const { container } = render(<AutomatedScoreBadge score={85} confidence="high" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-green-500/20')
  })

  it('hides label when showLabel is false', () => {
    render(<AutomatedScoreBadge score={75} confidence="high" showLabel={false} />)
    expect(screen.queryByText('Auto:')).not.toBeTruthy()
  })

  it('shows label when showLabel is true (default)', () => {
    render(<AutomatedScoreBadge score={75} confidence="high" />)
    expect(screen.getByText('Auto:')).toBeTruthy()
  })
})