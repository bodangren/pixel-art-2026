'use client'

import React from 'react'

interface AnimationControlsProps {
  isPlaying: boolean
  fps: number
  currentFrame: number
  totalFrames: number
  loopMode: 'once' | 'loop' | 'ping-pong'
  onPlayPause: () => void
  onFPSChange: (fps: number) => void
  onFrameChange: (frame: number) => void
  onLoopModeChange: (mode: 'once' | 'loop' | 'ping-pong') => void
}

export function AnimationControls({
  isPlaying,
  fps,
  currentFrame,
  totalFrames,
  loopMode,
  onPlayPause,
  onFPSChange,
  onFrameChange,
  onLoopModeChange,
}: AnimationControlsProps) {
  const idPrefix = React.useId()

  const handlePrev = () => {
    const prevFrame = currentFrame === 0 ? totalFrames - 1 : currentFrame - 1
    onFrameChange(prevFrame)
  }

  const handleNext = () => {
    const nextFrame = currentFrame === totalFrames - 1 ? 0 : currentFrame + 1
    onFrameChange(nextFrame)
  }

  const handleFPSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFPSChange(parseInt(e.target.value) || 1)
  }

  return (
    <div className="flex flex-col gap-3 p-4 border rounded bg-slate-900 text-white">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={onPlayPause}
            className="px-4 py-1.5 bg-blue-600 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handlePrev}
            className="px-3 py-1.5 bg-slate-700 rounded font-medium hover:bg-slate-600 transition-colors"
            aria-label="Previous frame"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1.5 bg-slate-700 rounded font-medium hover:bg-slate-600 transition-colors"
            aria-label="Next frame"
          >
            Next
          </button>
        </div>
        <FrameCounter currentFrame={currentFrame} totalFrames={totalFrames} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-fps`} className="text-slate-400">
            FPS: {fps}
          </label>
          <input
            id={`${idPrefix}-fps`}
            type="range"
            min="1"
            max="60"
            value={fps}
            onChange={handleFPSChange}
            className="w-full accent-blue-500"
            aria-label="Frames per second"
          />
        </div>
        <LoopModeSelector value={loopMode} onChange={onLoopModeChange} />
      </div>
    </div>
  )
}

interface LoopModeSelectorProps {
  value: 'once' | 'loop' | 'ping-pong'
  onChange: (mode: 'once' | 'loop' | 'ping-pong') => void
}

export function LoopModeSelector({ value, onChange }: LoopModeSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-slate-400 text-xs">Loop Mode</span>
      <div className="flex gap-3">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="loop-mode"
            value="once"
            checked={value === 'once'}
            onChange={() => onChange('once')}
            className="accent-blue-500"
          />
          <span className="text-xs">Once</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="loop-mode"
            value="loop"
            checked={value === 'loop'}
            onChange={() => onChange('loop')}
            className="accent-blue-500"
          />
          <span className="text-xs">Loop</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="loop-mode"
            value="ping-pong"
            checked={value === 'ping-pong'}
            onChange={() => onChange('ping-pong')}
            className="accent-blue-500"
          />
          <span className="text-xs">Ping-Pong</span>
        </label>
      </div>
    </div>
  )
}

interface FrameCounterProps {
  currentFrame: number
  totalFrames: number
}

export function FrameCounter({ currentFrame, totalFrames }: FrameCounterProps) {
  return (
    <div className="text-sm text-slate-300 font-mono">
      Frame: {currentFrame + 1} / {totalFrames}
    </div>
  )
}