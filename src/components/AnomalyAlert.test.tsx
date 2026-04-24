import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnomalyAlert } from './AnomalyAlert'

describe('AnomalyAlert', () => {
  it('renders anomalies', () => {
    const anomalies = [
      { value: 1.5, deviation: 1.0, direction: 'below' as const }
    ]
    render(<AnomalyAlert anomalies={anomalies} />)
    expect(screen.getByText(/anomaly/i)).toBeTruthy()
  })

  it('shows multiple anomaly count', () => {
    const anomalies = [
      { value: 1.5, deviation: 1.0, direction: 'below' as const },
      { value: 1.2, deviation: 1.3, direction: 'below' as const }
    ]
    render(<AnomalyAlert anomalies={anomalies} />)
    expect(screen.getByText('⚠')).toBeTruthy()
  })

  it('handles empty anomalies', () => {
    render(<AnomalyAlert anomalies={[]} />)
    expect(screen.getByText('No anomalies detected')).toBeTruthy()
  })
})