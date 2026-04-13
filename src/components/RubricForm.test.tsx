import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RubricForm from './RubricForm'

describe('RubricForm Component', () => {
  const mockOnSave = vi.fn()

  it('renders all rubric categories', () => {
    render(<RubricForm runId="test-run" onSave={mockOnSave} />)
    expect(screen.getByText(/Background/i)).toBeInTheDocument()
    expect(screen.getByText(/Hero/i)).toBeInTheDocument()
    expect(screen.getByText(/Enemy/i)).toBeInTheDocument()
    expect(screen.getByText(/Orb/i)).toBeInTheDocument()
    expect(screen.getByText(/Coherence/i)).toBeInTheDocument()
  })

  it('calculates weighted total score correctly', () => {
    render(<RubricForm runId="test-run" onSave={mockOnSave} />)
    
    // Default scores are 3. Weighted total should be 3.
    fireEvent.click(screen.getByText(/Save Final Review/i))
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      weighted_total_score: 3,
    }))
  })

  it('updates total score when ranges change', () => {
    render(<RubricForm runId="test-run" onSave={mockOnSave} />)
    
    // Set Hero to 5 (Weight 0.25)
    // Formula: (Bg*0.2 + Hero*0.25 + Enemy*0.2 + Orb*0.15 + Pack*0.2)
    // Initial: 3*0.2 + 3*0.25 + 3*0.2 + 3*0.15 + 3*0.2 = 3.0
    // Change Hero to 5: 3*0.2 + 5*0.25 + 3*0.2 + 3*0.15 + 3*0.2 = 0.6 + 1.25 + 0.6 + 0.45 + 0.6 = 3.5
    
    const heroInput = screen.getByLabelText(/Hero:/i)
    fireEvent.change(heroInput, { target: { value: '5' } })
    
    fireEvent.click(screen.getByText(/Save Final Review/i))
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      weighted_total_score: 3.5,
    }))
  })
})
