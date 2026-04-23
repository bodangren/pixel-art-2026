import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ComparisonView from './ComparisonView'

vi.mock('@/lib/data', () => ({
  getRun: vi.fn(),
  getReview: vi.fn(),
  listRuns: vi.fn()
}))

describe('ComparisonView Component', () => {
  const mockRunLeft = {
    run_id: 'run-001',
    model_id: 'GPT-5.4-medium',
    run_date: '2026-04-13',
    variant: 'standard',
    benchmark_id: 'pixel-art-v1',
    prompt_version: 'v1',
    asset_paths: {
      background: 'background.png',
      hero: 'hero-3x3-sheet.png',
      enemy: 'enemy-3x3-sheet.png',
      effect: 'effect-3x3-sheet.png'
    },
    status: 'completed' as const
  }

  const mockRunRight = {
    run_id: 'run-002',
    model_id: 'Claude-Sonnet-4.6',
    run_date: '2026-04-13',
    variant: 'standard',
    benchmark_id: 'pixel-art-v1',
    prompt_version: 'v1',
    asset_paths: {
      background: 'background.png',
      hero: 'hero-3x3-sheet.png',
      enemy: 'enemy-3x3-sheet.png',
      effect: 'effect-3x3-sheet.png'
    },
    status: 'completed' as const
  }

  const defaultProps = {
    runs: [mockRunLeft, mockRunRight],
    initialLeftRunId: 'run-001',
    initialRightRunId: 'run-002',
    assetKey: 'hero' as const,
    initialReviews: [
      { runId: 'run-001', review: null },
      { runId: 'run-002', review: null }
    ]
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders both selected runs with model names', () => {
    render(<ComparisonView {...defaultProps} />)
    
    expect(screen.getAllByText('GPT-5.4-medium').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Claude-Sonnet-4.6').length).toBeGreaterThanOrEqual(1)
  })

  it('renders zoom controls for both panels', () => {
    render(<ComparisonView {...defaultProps} />)
    
    const zoomControls = screen.getAllByLabelText(/Zoom:/i)
    expect(zoomControls).toHaveLength(2)
  })

  it('synchronizes zoom level between both panels', () => {
    render(<ComparisonView {...defaultProps} />)
    
    const zoomSelects = screen.getAllByLabelText(/Zoom:/i)
    
    fireEvent.change(zoomSelects[0], { target: { value: '4' } })
    
    expect(zoomSelects[0]).toHaveValue('4')
  })

  it('renders transparency toggle', () => {
    render(<ComparisonView {...defaultProps} />)
    
    expect(screen.getByLabelText(/transparent/i)).toBeInTheDocument()
  })

  it('renders asset dropdown to switch displayed asset', () => {
    render(<ComparisonView {...defaultProps} />)
    
    const assetSelect = screen.getByLabelText(/Asset/i)
    expect(assetSelect).toBeInTheDocument()
  })

  it('shows validation score comparison when reviews available', () => {
    render(<ComparisonView {...defaultProps} />)
    
    expect(screen.getByText(/score/i)).toBeInTheDocument()
  })

  it('allows selecting different runs from dropdown', () => {
    render(<ComparisonView {...defaultProps} />)
    
    const runSelects = screen.getAllByLabelText(/select run/i)
    expect(runSelects.length).toBe(2)
  })
})