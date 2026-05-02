import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimationControls, LoopModeSelector, FrameCounter } from './AnimationControls'

describe('AnimationControls', () => {
  const defaultProps = {
    isPlaying: false,
    fps: 12,
    currentFrame: 0,
    totalFrames: 8,
    loopMode: 'loop' as const,
    onPlayPause: vi.fn(),
    onFPSChange: vi.fn(),
    onFrameChange: vi.fn(),
    onLoopModeChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders play button when paused', () => {
      render(<AnimationControls {...defaultProps} />)
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
    })

    it('renders pause button when playing', () => {
      render(<AnimationControls {...defaultProps} isPlaying={true} />)
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument()
    })

    it('renders frame counter', () => {
      render(<AnimationControls {...defaultProps} currentFrame={3} totalFrames={8} />)
      expect(screen.getByText('Frame: 4 / 8')).toBeInTheDocument()
    })

    it('renders FPS slider', () => {
      render(<AnimationControls {...defaultProps} fps={24} />)
      const slider = screen.getByRole('slider', { name: /frames per second/i })
      expect(slider).toBeInTheDocument()
      expect(slider).toHaveValue('24')
    })

    it('renders prev/next step buttons', () => {
      render(<AnimationControls {...defaultProps} />)
      expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })
  })

  describe('play/pause', () => {
    it('calls onPlayPause when play button clicked', () => {
      render(<AnimationControls {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      expect(defaultProps.onPlayPause).toHaveBeenCalledTimes(1)
    })

    it('calls onPlayPause when pause button clicked', () => {
      render(<AnimationControls {...defaultProps} isPlaying={true} />)
      fireEvent.click(screen.getByRole('button', { name: /pause/i }))
      expect(defaultProps.onPlayPause).toHaveBeenCalledTimes(1)
    })
  })

  describe('frame stepping', () => {
    it('calls onFrameChange with prev frame on prev button click', () => {
      render(<AnimationControls {...defaultProps} currentFrame={3} totalFrames={8} />)
      fireEvent.click(screen.getByRole('button', { name: /prev/i }))
      expect(defaultProps.onFrameChange).toHaveBeenCalledWith(2)
    })

    it('calls onFrameChange with next frame on next button click', () => {
      render(<AnimationControls {...defaultProps} currentFrame={3} totalFrames={8} />)
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(defaultProps.onFrameChange).toHaveBeenCalledWith(4)
    })

    it('wraps to last frame when prev clicked on frame 0', () => {
      render(<AnimationControls {...defaultProps} currentFrame={0} totalFrames={8} />)
      fireEvent.click(screen.getByRole('button', { name: /prev/i }))
      expect(defaultProps.onFrameChange).toHaveBeenCalledWith(7)
    })

    it('wraps to frame 0 when next clicked on last frame', () => {
      render(<AnimationControls {...defaultProps} currentFrame={7} totalFrames={8} />)
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(defaultProps.onFrameChange).toHaveBeenCalledWith(0)
    })
  })

  describe('FPS slider', () => {
    it('calls onFPSChange when slider value changes', () => {
      render(<AnimationControls {...defaultProps} fps={12} />)
      const slider = screen.getByRole('slider', { name: /frames per second/i })
      fireEvent.change(slider, { target: { value: '24' } })
      expect(defaultProps.onFPSChange).toHaveBeenCalledWith(24)
    })
  })
})

describe('LoopModeSelector', () => {
  const defaultProps = {
    value: 'loop' as const,
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all three loop mode options', () => {
    render(<LoopModeSelector {...defaultProps} />)
    expect(screen.getByRole('radio', { name: /once/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /loop/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /ping-pong/i })).toBeInTheDocument()
  })

  it('calls onChange when loop mode selected', () => {
    render(<LoopModeSelector {...defaultProps} />)
    fireEvent.click(screen.getByRole('radio', { name: /once/i }))
    expect(defaultProps.onChange).toHaveBeenCalledWith('once')
  })

  it('shows current selection as checked', () => {
    render(<LoopModeSelector {...defaultProps} value="ping-pong" />)
    expect(screen.getByRole('radio', { name: /ping-pong/i })).toBeChecked()
    expect(screen.getByRole('radio', { name: /loop/i })).not.toBeChecked()
  })
})

describe('FrameCounter', () => {
  it('displays current and total frames', () => {
    render(<FrameCounter currentFrame={3} totalFrames={8} />)
    expect(screen.getByText('Frame: 4 / 8')).toBeInTheDocument()
  })

  it('displays frame 1 as first frame (not 0)', () => {
    render(<FrameCounter currentFrame={0} totalFrames={8} />)
    expect(screen.getByText('Frame: 1 / 8')).toBeInTheDocument()
  })

  it('displays last frame correctly', () => {
    render(<FrameCounter currentFrame={7} totalFrames={8} />)
    expect(screen.getByText('Frame: 8 / 8')).toBeInTheDocument()
  })
})