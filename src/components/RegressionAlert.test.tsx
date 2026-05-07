import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RegressionAlert } from './RegressionAlert'

describe('RegressionAlert', () => {
  it('renders no regression when all scores are above threshold', () => {
    render(
      <RegressionAlert
        diffScores={{ background: 0.98, hero: 0.95, enemy: 0.92, effect: 0.91 }}
        comparedAgainstRunId="run-0"
      />
    )
    expect(screen.getByText('No regression detected')).toBeInTheDocument()
  })

  it('renders regression alert when scores are below threshold', () => {
    render(
      <RegressionAlert
        diffScores={{ background: 0.80, hero: 0.85, enemy: 0.92, effect: 0.91 }}
        comparedAgainstRunId="run-1"
      />
    )
    expect(screen.getByText(/Regression detected/)).toBeInTheDocument()
    expect(screen.getByText(/2 assets/)).toBeInTheDocument()
  })

  it('shows asset-specific diff scores when regressed', () => {
    render(
      <RegressionAlert
        diffScores={{ background: 0.80, hero: 0.85, enemy: 0.92, effect: 0.91 }}
        comparedAgainstRunId="run-1"
      />
    )
    expect(screen.getByText(/Background: 0.800/)).toBeInTheDocument()
    expect(screen.getByText(/Hero: 0.850/)).toBeInTheDocument()
  })

  it('shows compared against run id', () => {
    render(
      <RegressionAlert
        diffScores={{ background: 0.98, hero: 0.95, enemy: 0.92, effect: 0.91 }}
        comparedAgainstRunId="run-1"
      />
    )
    expect(screen.getByText(/Compared against/)).toBeInTheDocument()
    expect(screen.getByText(/run-1/)).toBeInTheDocument()
  })

  it('handles single regressed asset', () => {
    render(
      <RegressionAlert
        diffScores={{ background: 0.80, hero: 0.95, enemy: 0.92, effect: 0.91 }}
        comparedAgainstRunId="run-1"
      />
    )
    expect(screen.getByText(/1 asset/)).toBeInTheDocument()
  })
})