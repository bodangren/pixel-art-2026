import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SpriteSheetPreview from './SpriteSheetPreview'

describe('SpriteSheetPreview Component', () => {
  const defaultProps = {
    src: '/test-sprite.png',
    rows: 3,
    cols: 3,
    frameSize: 64, // 192 / 3
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders initial state correctly', () => {
    render(<SpriteSheetPreview {...defaultProps} />)
    expect(screen.getByText(/Frame: 1 \/ 9/i)).toBeInTheDocument()
    expect(screen.getByText(/Pause/i)).toBeInTheDocument()
  })

  it('cycles through frames when playing', () => {
    render(<SpriteSheetPreview {...defaultProps} />)
    
    // Initial frame
    expect(screen.getByText(/Frame: 1 \/ 9/i)).toBeInTheDocument()

    // Advance time by 125ms (for 8 FPS)
    act(() => {
      vi.advanceTimersByTime(125)
    })
    expect(screen.getByText(/Frame: 2 \/ 9/i)).toBeInTheDocument()

    // Advance more
    act(() => {
      vi.advanceTimersByTime(125 * 7)
    })
    expect(screen.getByText(/Frame: 9 \/ 9/i)).toBeInTheDocument()

    // Wrap around
    act(() => {
      vi.advanceTimersByTime(125)
    })
    expect(screen.getByText(/Frame: 1 \/ 9/i)).toBeInTheDocument()
  })

  it('pauses and resumes animation', () => {
    render(<SpriteSheetPreview {...defaultProps} />)
    
    const pauseButton = screen.getByText(/Pause/i)
    fireEvent.click(pauseButton)
    expect(screen.getByText(/Play/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    // Should still be at frame 1
    expect(screen.getByText(/Frame: 1 \/ 9/i)).toBeInTheDocument()
  })

  it('updates FPS and cycles accordingly', () => {
    render(<SpriteSheetPreview {...defaultProps} />)
    
    const fpsInput = screen.getByLabelText(/FPS: 8/i)
    fireEvent.change(fpsInput, { target: { value: '10' } })
    
    expect(screen.getByText(/FPS: 10/i)).toBeInTheDocument()

    // 10 FPS = 100ms per frame
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.getByText(/Frame: 2 \/ 9/i)).toBeInTheDocument()
  })
})
