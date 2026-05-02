import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SpriteSheetPreview from './SpriteSheetPreview'
import React from 'react'

describe('SpriteSheetPreview', () => {
  const defaultProps = {
    src: '/test-sprite.png',
    rows: 2,
    cols: 4,
    frameSize: 32,
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rendering', () => {
    it('renders sprite animation container', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByText('Sprite Animation')).toBeInTheDocument()
    })

    it('renders play/pause button', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })

    it('renders grid toggle button', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument()
    })

    it('shows initial frame counter as 1/8', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByText(/frame: 1 \/ 8/i)).toBeInTheDocument()
    })
  })

  describe('play/pause toggle', () => {
    it('changes button text to play when paused', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /pause/i }))
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    })

    it('changes button text to pause when playing', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })
  })

  describe('animation auto-advance', () => {
    it('auto-advances frames when playing', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      const frameDisplay = screen.getByText(/frame: 1 \/ 8/i)
      expect(frameDisplay).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000 / 8 + 10)
      })
    })
  })

  describe('grid toggle', () => {
    it('toggles grid on and off', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      const gridButton = screen.getByRole('button', { name: /grid/i })
      fireEvent.click(gridButton)
      expect(gridButton).toHaveClass('bg-green-600')
    })
  })

  describe('frame stepping via controls', () => {
    it('renders prev/next step buttons', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('renders loop mode selector', () => {
      render(<SpriteSheetPreview {...defaultProps} />)
      expect(screen.getByRole('radio', { name: /loop/i })).toBeInTheDocument()
    })
  })
})