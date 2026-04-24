import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BatchProgress from './BatchProgress'
import { BatchProgress as BatchProgressType } from '@/lib/batch'

describe('BatchProgress', () => {
  it('renders progress with all status counts', () => {
    const progress: BatchProgressType = {
      total_jobs: 10,
      pending: 2,
      running: 3,
      completed: 4,
      failed: 1,
      cancelled: 0
    }

    render(<BatchProgress progress={progress} totalJobs={10} />)

    expect(screen.getByText('Batch Progress')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
    expect(screen.getByText('3')).toBeTruthy()
    expect(screen.getByText('4')).toBeTruthy()
    expect(screen.getByText('1')).toBeTruthy()
  })

  it('displays percentage correctly', () => {
    const progress: BatchProgressType = {
      total_jobs: 10,
      pending: 0,
      running: 0,
      completed: 5,
      failed: 5,
      cancelled: 0
    }

    render(<BatchProgress progress={progress} totalJobs={10} />)

    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('shows failed count in summary when failures exist', () => {
    const progress: BatchProgressType = {
      total_jobs: 10,
      pending: 0,
      running: 0,
      completed: 8,
      failed: 2,
      cancelled: 0
    }

    render(<BatchProgress progress={progress} totalJobs={10} />)

    expect(screen.getByText('(2 failed)')).toBeTruthy()
  })

  it('does not show failed label when no failures', () => {
    const progress: BatchProgressType = {
      total_jobs: 10,
      pending: 0,
      running: 0,
      completed: 10,
      failed: 0,
      cancelled: 0
    }

    render(<BatchProgress progress={progress} totalJobs={10} />)

    expect(screen.queryByText('(0 failed)')).toBeNull()
  })

  it('renders all status labels', () => {
    const progress: BatchProgressType = {
      total_jobs: 5,
      pending: 1,
      running: 1,
      completed: 1,
      failed: 1,
      cancelled: 1
    }

    render(<BatchProgress progress={progress} totalJobs={5} />)

    expect(screen.getByText('Pending')).toBeTruthy()
    expect(screen.getByText('Running')).toBeTruthy()
    expect(screen.getByText('Completed')).toBeTruthy()
    expect(screen.getByText('Failed')).toBeTruthy()
    expect(screen.getByText('Cancelled')).toBeTruthy()
  })
})