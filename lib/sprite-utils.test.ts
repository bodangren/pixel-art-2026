import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { extractFrames, FramePlayer } from './sprite-utils'

describe('extractFrames', () => {
  it('extracts correct number of frames from sprite sheet', () => {
    const imageData = { width: 128, height: 64 } as ImageData
    const frames = extractFrames(imageData, 32, 32)
    expect(frames).toHaveLength(8)
  })

  it('returns empty array for zero frame width', () => {
    const imageData = { width: 128, height: 64 } as ImageData
    const frames = extractFrames(imageData, 0, 32)
    expect(frames).toHaveLength(0)
  })

  it('returns empty array for zero frame height', () => {
    const imageData = { width: 128, height: 64 } as ImageData
    const frames = extractFrames(imageData, 32, 0)
    expect(frames).toHaveLength(0)
  })

  it('calculates correct frame positions in row-major order', () => {
    const imageData = { width: 64, height: 64 } as ImageData
    const frames = extractFrames(imageData, 32, 32)
    expect(frames).toHaveLength(4)
    expect(frames[0]).toEqual({ x: 0, y: 0, width: 32, height: 32 })
    expect(frames[1]).toEqual({ x: 32, y: 0, width: 32, height: 32 })
    expect(frames[2]).toEqual({ x: 0, y: 32, width: 32, height: 32 })
    expect(frames[3]).toEqual({ x: 32, y: 32, width: 32, height: 32 })
  })

  it('handles single row sprite sheet', () => {
    const imageData = { width: 128, height: 32 } as ImageData
    const frames = extractFrames(imageData, 32, 32)
    expect(frames).toHaveLength(4)
    expect(frames[0]).toEqual({ x: 0, y: 0, width: 32, height: 32 })
    expect(frames[3]).toEqual({ x: 96, y: 0, width: 32, height: 32 })
  })

  it('returns 2 frames for 64x32 image with 32x32 frames', () => {
    const imageData = { width: 64, height: 32 } as ImageData
    const frames = extractFrames(imageData, 32, 32)
    expect(frames).toHaveLength(2)
    expect(frames[0]).toEqual({ x: 0, y: 0, width: 32, height: 32 })
    expect(frames[1]).toEqual({ x: 32, y: 0, width: 32, height: 32 })
  })

  it('handles single row sprite sheet', () => {
    const imageData = { width: 128, height: 32 } as ImageData
    const frames = extractFrames(imageData, 32, 32)
    expect(frames).toHaveLength(4)
    expect(frames[0]).toEqual({ x: 0, y: 0, width: 32, height: 32 })
    expect(frames[3]).toEqual({ x: 96, y: 0, width: 32, height: 32 })
  })
})

describe('FramePlayer', () => {
  let player: FramePlayer

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initialization', () => {
    it('creates player with correct frame count', () => {
      player = new FramePlayer(8, 12)
      expect(player.frameCount).toBe(8)
    })

    it('starts at frame 0', () => {
      player = new FramePlayer(8, 12)
      expect(player.currentFrame).toBe(0)
    })

    it('starts in paused state', () => {
      player = new FramePlayer(8, 12)
      expect(player.isPlaying).toBe(false)
    })

    it('defaults to loop mode', () => {
      player = new FramePlayer(8, 12)
      expect(player.loopMode).toBe('loop')
    })
  })

  describe('play/pause', () => {
    it('play() sets isPlaying to true', () => {
      player = new FramePlayer(8, 12)
      player.play()
      expect(player.isPlaying).toBe(true)
    })

    it('pause() sets isPlaying to false', () => {
      player = new FramePlayer(8, 12)
      player.play()
      player.pause()
      expect(player.isPlaying).toBe(false)
    })

    it('toggle() alternates between play and pause', () => {
      player = new FramePlayer(8, 12)
      expect(player.isPlaying).toBe(false)
      player.toggle()
      expect(player.isPlaying).toBe(true)
      player.toggle()
      expect(player.isPlaying).toBe(false)
    })
  })

  describe('frame stepping', () => {
    it('next() advances to next frame', () => {
      player = new FramePlayer(8, 12)
      player.next()
      expect(player.currentFrame).toBe(1)
    })

    it('next() wraps to 0 at end in loop mode', () => {
      player = new FramePlayer(4, 12)
      player.currentFrame = 3
      player.next()
      expect(player.currentFrame).toBe(0)
    })

    it('prev() goes to previous frame', () => {
      player = new FramePlayer(8, 12)
      player.currentFrame = 3
      player.prev()
      expect(player.currentFrame).toBe(2)
    })

    it('prev() wraps to last frame from 0', () => {
      player = new FramePlayer(4, 12)
      player.prev()
      expect(player.currentFrame).toBe(3)
    })

    it('goTo() jumps to specific frame', () => {
      player = new FramePlayer(8, 12)
      player.goTo(5)
      expect(player.currentFrame).toBe(5)
    })

    it('goTo() clamps to valid range', () => {
      player = new FramePlayer(8, 12)
      player.goTo(100)
      expect(player.currentFrame).toBe(7)
      player.goTo(-1)
      expect(player.currentFrame).toBe(0)
    })
  })

  describe('FPS control', () => {
    it('setFPS() updates fps', () => {
      player = new FramePlayer(8, 12)
      player.setFPS(24)
      expect(player.fps).toBe(24)
    })

    it('setFPS() clamps to valid range 1-60', () => {
      player = new FramePlayer(8, 12)
      player.setFPS(0)
      expect(player.fps).toBe(1)
      player.setFPS(100)
      expect(player.fps).toBe(60)
    })
  })

  describe('loop modes', () => {
    it('setLoopMode() changes loop mode', () => {
      player = new FramePlayer(8, 12)
      player.setLoopMode('once')
      expect(player.loopMode).toBe('once')
    })

    it('loop mode once stops at last frame', () => {
      player = new FramePlayer(4, 12, 'once')
      player.currentFrame = 3
      player.next()
      expect(player.currentFrame).toBe(3)
    })

    it('loop mode ping-pong reverses direction at ends', () => {
      player = new FramePlayer(4, 12, 'ping-pong')
      expect(player.direction).toBe(1)
      player.currentFrame = 3
      player.next()
      expect(player.direction).toBe(-1)
    })

    it('loop mode ping-pong goes to correct frame after boundary', () => {
      player = new FramePlayer(4, 12, 'ping-pong')
      player.currentFrame = 3
      player.next()
      expect(player.currentFrame).toBe(3)
      player.next()
      expect(player.currentFrame).toBe(2)
      expect(player.direction).toBe(-1)
    })
  })

  describe('onFrameChange callback', () => {
    it('calls callback when frame changes', () => {
      const callback = vi.fn()
      player = new FramePlayer(8, 12, 'loop', callback)
      player.next()
      expect(callback).toHaveBeenCalledWith(1)
    })

    it('passes correct frame to callback', () => {
      const callback = vi.fn()
      player = new FramePlayer(8, 12, 'loop', callback)
      player.goTo(5)
      expect(callback).toHaveBeenCalledWith(5)
    })
  })
})

describe('ping-pong frame sequence', () => {
  it('generates correct sequence for 4 frames', () => {
    const sequence = generatePingPongSequence(4)
    expect(sequence).toEqual([0, 1, 2, 3, 2, 1])
  })

  it('generates correct sequence for 2 frames', () => {
    const sequence = generatePingPongSequence(2)
    expect(sequence).toEqual([0, 1])
  })

  it('generates correct sequence for 1 frame', () => {
    const sequence = generatePingPongSequence(1)
    expect(sequence).toEqual([0])
  })
})

function generatePingPongSequence(frameCount: number): number[] {
  if (frameCount <= 1) return [0]
  const sequence: number[] = []
  for (let i = 0; i < frameCount; i++) sequence.push(i)
  for (let i = frameCount - 2; i >= 1; i--) sequence.push(i)
  return sequence
}