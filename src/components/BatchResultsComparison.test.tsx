import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BatchResultsComparison from './BatchResultsComparison'
import { BatchResult } from '@/lib/batch-results'

describe('BatchResultsComparison', () => {
  it('shows empty state when no results', () => {
    render(<BatchResultsComparison results={[]} />)
    expect(screen.getByText('No batch results to display.')).toBeTruthy()
  })

  it('displays batch result rows', () => {
    const results: BatchResult[] = [
      {
        batch_id: 'batch__001',
        created_at: '2026-04-24T00:00:00Z',
        games: ['game1'],
        models: ['model1'],
        total_jobs: 10,
        completed_jobs: 8,
        failed_jobs: 2,
        total_duration_ms: 5000,
        model_stats: { model1: { games_completed: 8, games_failed: 2 } }
      }
    ]

    render(<BatchResultsComparison results={results} />)

    expect(screen.getByText('batch__001')).toBeTruthy()
    expect(screen.getByText('10')).toBeTruthy()
    expect(screen.getByText('8')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
  })

  it('shows success rate percentage', () => {
    const results: BatchResult[] = [
      {
        batch_id: 'batch__test',
        created_at: '2026-04-24T00:00:00Z',
        games: ['g1'],
        models: ['m1'],
        total_jobs: 4,
        completed_jobs: 3,
        failed_jobs: 1,
        total_duration_ms: 1000,
        model_stats: { m1: { games_completed: 3, games_failed: 1 } }
      }
    ]

    render(<BatchResultsComparison results={results} />)

    expect(screen.getByText('75%')).toBeTruthy()
  })

  it('displays duration in seconds', () => {
    const results: BatchResult[] = [
      {
        batch_id: 'batch__dur',
        created_at: '2026-04-24T00:00:00Z',
        games: ['g1'],
        models: ['m1'],
        total_jobs: 2,
        completed_jobs: 2,
        failed_jobs: 0,
        total_duration_ms: 5500,
        model_stats: { m1: { games_completed: 2, games_failed: 0 } }
      }
    ]

    render(<BatchResultsComparison results={results} />)

    expect(screen.getByText('5.5s')).toBeTruthy()
  })
})