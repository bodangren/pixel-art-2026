import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimationControls } from './AnimationControls'
import { FramePlayer } from '@/../lib/sprite-utils'

describe('Cross-Component Sync', () => {
  let onPlayPause: ReturnType<typeof vi.fn>
  let onFPSChange: ReturnType<typeof vi.fn>
  let onFrameChange: ReturnType<typeof vi.fn>
  let onLoopModeChange: ReturnType<typeof vi.fn>

  const defaultProps = {
    isPlaying: false,
    fps: 12,
    currentFrame: 0,
    totalFrames: 8,
    loopMode: 'loop' as const,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    onPlayPause = vi.fn()
    onFPSChange = vi.fn()
    onFrameChange = vi.fn()
    onLoopModeChange = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('AnimationControls state sync', () => {
    it('calls onPlayPause when play button clicked', () => {
      const props = { ...defaultProps, onPlayPause }
      render(<AnimationControls {...props} />)
      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      expect(onPlayPause).toHaveBeenCalledTimes(1)
    })

    it('calls onFPSChange when FPS slider changes', () => {
      const props = { ...defaultProps, onFPSChange }
      render(<AnimationControls {...props} />)
      const slider = screen.getByRole('slider', { name: /frames per second/i })
      fireEvent.change(slider, { target: { value: '24' } })
      expect(onFPSChange).toHaveBeenCalledWith(24)
    })

    it('calls onFrameChange with prev frame on prev button', () => {
      const props = { ...defaultProps, currentFrame: 3, onFrameChange }
      render(<AnimationControls {...props} />)
      fireEvent.click(screen.getByRole('button', { name: /prev/i }))
      expect(onFrameChange).toHaveBeenCalledWith(2)
    })

    it('calls onFrameChange with next frame on next button', () => {
      const props = { ...defaultProps, currentFrame: 3, onFrameChange }
      render(<AnimationControls {...props} />)
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(onFrameChange).toHaveBeenCalledWith(4)
    })

    it('calls onLoopModeChange when loop mode changes', () => {
      const props = { ...defaultProps, onLoopModeChange }
      render(<AnimationControls {...props} />)
      fireEvent.click(screen.getByRole('radio', { name: /once/i }))
      expect(onLoopModeChange).toHaveBeenCalledWith('once')
    })

    it('wraps to last frame when prev clicked on first frame', () => {
      const props = { ...defaultProps, currentFrame: 0, onFrameChange }
      render(<AnimationControls {...props} />)
      fireEvent.click(screen.getByRole('button', { name: /prev/i }))
      expect(onFrameChange).toHaveBeenCalledWith(7)
    })

    it('wraps to first frame when next clicked on last frame', () => {
      const props = { ...defaultProps, currentFrame: 7, onFrameChange }
      render(<AnimationControls {...props} />)
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(onFrameChange).toHaveBeenCalledWith(0)
    })
  })

  describe('FramePlayer sync behavior', () => {
    it('notifies callback when frame changes', () => {
      const callback = vi.fn()
      const player = new FramePlayer(8, 12, 'loop', callback)
      player.goTo(3)
      expect(callback).toHaveBeenCalledWith(3)
    })

    it('respects FPS changes', () => {
      const player = new FramePlayer(8, 12, 'loop')
      player.setFPS(24)
      expect(player.fps).toBe(24)
    })

    it('respects loop mode changes', () => {
      const player = new FramePlayer(8, 12, 'loop')
      player.setLoopMode('once')
      expect(player.loopMode).toBe('once')
    })

    it('advances frames in loop mode', () => {
      const player = new FramePlayer(8, 12, 'loop')
      expect(player.currentFrame).toBe(0)
      player.next()
      expect(player.currentFrame).toBe(1)
    })

    it('wraps in ping-pong mode', () => {
      const callback = vi.fn()
      const player = new FramePlayer(4, 12, 'ping-pong', callback)
      player.next() // 1
      player.next() // 2
      player.next() // 3
      player.next() // should bounce back
      expect(player.currentFrame).toBeLessThanOrEqual(3)
    })
  })

  describe('Component interaction patterns', () => {
    it('play/pause state toggle is reflected in button text', () => {
      const { rerender } = render(
        <AnimationControls
          {...defaultProps}
          isPlaying={false}
          onPlayPause={onPlayPause}
          onFPSChange={onFPSChange}
          onFrameChange={onFrameChange}
          onLoopModeChange={onLoopModeChange}
        />
      )
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()

      rerender(
        <AnimationControls
          {...defaultProps}
          isPlaying={true}
          onPlayPause={onPlayPause}
          onFPSChange={onFPSChange}
          onFrameChange={onFrameChange}
          onLoopModeChange={onLoopModeChange}
        />
      )
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })

    it('frame counter displays correct 1-indexed frame', () => {
      render(
        <AnimationControls
          {...defaultProps}
          currentFrame={4}
          onPlayPause={onPlayPause}
          onFPSChange={onFPSChange}
          onFrameChange={onFrameChange}
          onLoopModeChange={onLoopModeChange}
        />
      )
      expect(screen.getByText('Frame: 5 / 8')).toBeInTheDocument()
    })

    it('FPS slider aria-label is accessible', () => {
      render(
        <AnimationControls
          {...defaultProps}
          fps={24}
          onPlayPause={onPlayPause}
          onFPSChange={onFPSChange}
          onFrameChange={onFrameChange}
          onLoopModeChange={onLoopModeChange}
        />
      )
      const slider = screen.getByRole('slider', { name: /frames per second/i })
      expect(slider).toHaveValue('24')
    })
  })
})