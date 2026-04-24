import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FailureReport from './FailureReport'
import { BatchJob } from '@/lib/batch'

describe('FailureReport', () => {
  it('shows success message when no failures', () => {
    render(<FailureReport failedJobs={[]} />)

    expect(screen.getByText('No Failures')).toBeTruthy()
    expect(screen.getByText('All jobs completed successfully.')).toBeTruthy()
  })

  it('displays failed job count', () => {
    const failedJobs: BatchJob[] = [
      {
        id: 'job__1',
        game_slug: 'game1',
        model_id: 'model1',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 2,
        error: 'Timeout error'
      },
      {
        id: 'job__2',
        game_slug: 'game2',
        model_id: 'model2',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 1,
        error: 'API error'
      }
    ]

    render(<FailureReport failedJobs={failedJobs} />)

    expect(screen.getByText('2 Failed Jobs')).toBeTruthy()
  })

  it('shows singular "Failed Job" for one failure', () => {
    const failedJobs: BatchJob[] = [
      {
        id: 'job__1',
        game_slug: 'game1',
        model_id: 'model1',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 1,
        error: 'Test error'
      }
    ]

    render(<FailureReport failedJobs={failedJobs} />)

    expect(screen.getByText('1 Failed Job')).toBeTruthy()
  })

  it('displays game and model for each failure', () => {
    const failedJobs: BatchJob[] = [
      {
        id: 'job__1',
        game_slug: 'labyrinth-goblin-king',
        model_id: 'gemini-3.1-pro',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 0,
        error: 'Generation failed'
      }
    ]

    render(<FailureReport failedJobs={failedJobs} />)

    expect(screen.getByText('labyrinth-goblin-king')).toBeTruthy()
    expect(screen.getByText('gemini-3.1-pro')).toBeTruthy()
  })

  it('displays error messages', () => {
    const failedJobs: BatchJob[] = [
      {
        id: 'job__1',
        game_slug: 'game1',
        model_id: 'model1',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 3,
        error: 'Connection refused after 3 attempts'
      }
    ]

    render(<FailureReport failedJobs={failedJobs} />)

    expect(screen.getByText('Connection refused after 3 attempts')).toBeTruthy()
  })

  it('shows retry count for each failed job', () => {
    const failedJobs: BatchJob[] = [
      {
        id: 'job__1',
        game_slug: 'game1',
        model_id: 'model1',
        status: 'failed',
        created_at: '2026-04-24T00:00:00Z',
        retry_count: 2,
        error: 'Error'
      }
    ]

    render(<FailureReport failedJobs={failedJobs} />)

    expect(screen.getByText('Retries: 2')).toBeTruthy()
  })
})