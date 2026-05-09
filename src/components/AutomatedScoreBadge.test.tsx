import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AutomatedScoreBadge from './AutomatedScoreBadge'

describe('AutomatedScoreBadge', () => {
  it('renders score value', () => {
    render(<AutomatedScoreBadge score={75.5} confidence="high" />)
    expect(screen.getByText('75.5')).toBeTruthy()
  })

  it('renders high confidence indicator', () => {
    render(<AutomatedScoreBadge score={75.5} confidence="high" />)
    const dots = document.querySelectorAll('.bg-green-500')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('renders medium confidence indicator', () => {
    render(<AutomatedScoreBadge score={50} confidence="medium" />)
    const dots = document.querySelectorAll('.bg-yellow-500')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('renders low confidence indicator', () => {
    render(<AutomatedScoreBadge score={25} confidence="low" />)
    const dots = document.querySelectorAll('.bg-red-500')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('applies red color for scores below 40', () => {
    render(<AutomatedScoreBadge score={35} confidence="low" />)
    const badge = document.querySelector('.bg-red-500\\/20')
    expect(badge).toBeTruthy()
  })

  it('applies yellow color for scores 40-70', () => {
    render(<AutomatedScoreBadge score={55} confidence="medium" />)
    const badge = document.querySelector('.bg-yellow-500\\/20')
    expect(badge).toBeTruthy()
  })

  it('applies green color for scores 70+', () => {
    render(<AutomatedScoreBadge score={85} confidence="high" />)
    const badge = document.querySelector('.bg-green-500\\/20')
    expect(badge).toBeTruthy()
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