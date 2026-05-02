export type LoopMode = 'once' | 'loop' | 'ping-pong'

export interface FrameRect {
  x: number
  y: number
  width: number
  height: number
}

export function extractFrames(
  imageData: ImageData,
  frameWidth: number,
  frameHeight: number
): FrameRect[] {
  if (frameWidth <= 0 || frameHeight <= 0) return []

  const framesX = Math.floor(imageData.width / frameWidth)
  const framesY = Math.floor(imageData.height / frameHeight)

  if (framesX === 0 || framesY === 0) return []

  const frames: FrameRect[] = []

  for (let row = 0; row < framesY; row++) {
    for (let col = 0; col < framesX; col++) {
      frames.push({
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight,
      })
    }
  }

  return frames
}

export type FrameChangeCallback = (frame: number) => void

export class FramePlayer {
  private _currentFrame = 0
  private _isPlaying = false
  private _fps: number
  private _loopMode: LoopMode
  private _direction = 1
  private _callback: FrameChangeCallback | null
  private _frameCount: number

  constructor(
    frameCount: number,
    fps = 12,
    loopMode: LoopMode = 'loop',
    onFrameChange?: FrameChangeCallback
  ) {
    this._frameCount = frameCount
    this._fps = Math.max(1, Math.min(60, fps))
    this._loopMode = loopMode
    this._callback = onFrameChange ?? null
  }

  get frameCount(): number {
    return this._frameCount
  }

  get currentFrame(): number {
    return this._currentFrame
  }

  set currentFrame(frame: number) {
    this._currentFrame = Math.max(0, Math.min(this._frameCount - 1, frame))
  }

  get isPlaying(): boolean {
    return this._isPlaying
  }

  get fps(): number {
    return this._fps
  }

  get loopMode(): LoopMode {
    return this._loopMode
  }

  get direction(): number {
    return this._direction
  }

  play(): void {
    this._isPlaying = true
  }

  pause(): void {
    this._isPlaying = false
  }

  toggle(): void {
    if (this._isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  next(): void {
    if (this._loopMode === 'once') {
      if (this._currentFrame < this._frameCount - 1) {
        this._currentFrame++
        this._notify()
      }
    } else if (this._loopMode === 'ping-pong') {
      const nextFrame = this._currentFrame + this._direction
      if (nextFrame >= this._frameCount || nextFrame < 0) {
        this._direction = -this._direction
      }
      this._currentFrame = Math.max(0, Math.min(this._frameCount - 1, nextFrame))
      this._notify()
    } else {
      this._currentFrame = (this._currentFrame + 1) % this._frameCount
      this._notify()
    }
  }

  prev(): void {
    if (this._currentFrame === 0) {
      this._currentFrame = this._frameCount - 1
    } else {
      this._currentFrame--
    }
    this._notify()
  }

  goTo(frame: number): void {
    this._currentFrame = Math.max(0, Math.min(this._frameCount - 1, frame))
    this._notify()
  }

  setFPS(fps: number): void {
    this._fps = Math.max(1, Math.min(60, fps))
  }

  setLoopMode(mode: LoopMode): void {
    this._loopMode = mode
  }

  private _notify(): void {
    if (this._callback && !this._isPlaying) {
      this._callback(this._currentFrame)
    }
  }

  autoAdvance(): void {
    if (!this._isPlaying) return

    const interval = 1000 / this._fps
    setTimeout(() => {
      if (this._isPlaying) {
        this.next()
        this.autoAdvance()
      }
    }, interval)
  }
}