import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BatchConfigForm from './BatchConfigForm'

describe('BatchConfigForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders game and model checkboxes', () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)
    expect(screen.getByRole('checkbox', { name: 'Labyrinth of the Goblin King' })).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'Gemini 3.1 Pro' })).toBeTruthy()
  })

  it('disables submit when no selections made', () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)
    const submitBtn = screen.getByRole('button', { name: 'Start Batch Run' }) as HTMLButtonElement
    expect(submitBtn.disabled).toBe(true)
  })

  it('enables submit when at least one game and model selected', async () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)

    const labyCheckbox = screen.getByRole('checkbox', { name: 'Labyrinth of the Goblin King' })
    const geminiCheckbox = screen.getByRole('checkbox', { name: 'Gemini 3.1 Pro' })

    fireEvent.click(labyCheckbox)
    fireEvent.click(geminiCheckbox)

    const submitBtn = screen.getByRole('button', { name: 'Start Batch Run' }) as HTMLButtonElement
    expect(submitBtn.disabled).toBe(false)
  })

  it('calls onSubmit with correct config', async () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)

    const labyCheckbox = screen.getByRole('checkbox', { name: 'Labyrinth of the Goblin King' })
    const geminiCheckbox = screen.getByRole('checkbox', { name: 'Gemini 3.1 Pro' })

    fireEvent.click(labyCheckbox)
    fireEvent.click(geminiCheckbox)
    fireEvent.click(screen.getByRole('button', { name: 'Start Batch Run' }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      games: ['labyrinth-goblin-king'],
      models: ['gemini-3.1-pro'],
      maxConcurrency: 3,
      retryLimit: 3,
    })
  })

  it('allows multiple selections', async () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Labyrinth of the Goblin King' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Dungeon Crawler' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Gemini 3.1 Pro' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'GPT-5.3 Codex Medium' }))

    fireEvent.click(screen.getByRole('button', { name: 'Start Batch Run' }))

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        games: ['labyrinth-goblin-king', 'dungeon-crawler'],
        models: ['gemini-3.1-pro', 'gpt-5.3-codex-medium'],
      })
    )
  })

  it('allows deselection', async () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)

    const labyCheckbox = screen.getByRole('checkbox', { name: 'Labyrinth of the Goblin King' })
    const geminiCheckbox = screen.getByRole('checkbox', { name: 'Gemini 3.1 Pro' })

    fireEvent.click(labyCheckbox)
    expect(screen.getByRole('button', { name: 'Start Batch Run' })).toBeDisabled()

    fireEvent.click(geminiCheckbox)
    expect(screen.getByRole('button', { name: 'Start Batch Run' })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Start Batch Run' }))

    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        games: ['labyrinth-goblin-king'],
        models: ['gemini-3.1-pro'],
      })
    )
  })

  it('respects concurrency and retry limit inputs', async () => {
    render(<BatchConfigForm onSubmit={mockOnSubmit} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Labyrinth of the Goblin King' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Gemini 3.1 Pro' }))

    const concurrencyInput = screen.getByLabelText('Max Concurrency') as HTMLInputElement
    fireEvent.change(concurrencyInput, { target: { value: '5' } })

    const retryInput = screen.getByLabelText('Retry Limit') as HTMLInputElement
    fireEvent.change(retryInput, { target: { value: '2' } })

    fireEvent.click(screen.getByRole('button', { name: 'Start Batch Run' }))

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        maxConcurrency: 5,
        retryLimit: 2,
      })
    )
  })
})