'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AnimationControls } from './AnimationControls'
import { FramePlayer } from '@/../lib/sprite-utils'

interface SpriteSheetPreviewProps {
  src: string
  rows: number
  cols: number
  frameSize: number
}

const SpriteSheetPreview: React.FC<SpriteSheetPreviewProps> = ({ src, rows, cols, frameSize }) => {
  const [frame, setFrame] = useState(0)
  const [fps, setFps] = useState(8)
  const [zoom, setZoom] = useState(4)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [loopMode, setLoopMode] = useState<'once' | 'loop' | 'ping-pong'>('loop')
  const totalFrames = rows * cols

  const playerRef = React.useRef<FramePlayer | null>(null)

  useEffect(() => {
    playerRef.current = new FramePlayer(totalFrames, fps, loopMode, (newFrame) => {
      setFrame(newFrame)
    })
  }, [totalFrames, fps, loopMode])

  useEffect(() => {
    if (!isPlaying) return

    const interval = 1000 / fps
    const timer = setInterval(() => {
      if (playerRef.current) {
        playerRef.current.next()
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, fps])

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p)
  }, [])

  const handleFPSChange = useCallback((newFps: number) => {
    setFps(newFps)
    if (playerRef.current) {
      playerRef.current.setFPS(newFps)
    }
  }, [])

  const handleFrameChange = useCallback((newFrame: number) => {
    setIsPlaying(false)
    setFrame(newFrame)
    if (playerRef.current) {
      playerRef.current.goTo(newFrame)
    }
  }, [])

  const handleLoopModeChange = useCallback((mode: 'once' | 'loop' | 'ping-pong') => {
    setLoopMode(mode)
    if (playerRef.current) {
      playerRef.current.setLoopMode(mode)
    }
  }, [])

  const row = Math.floor(frame / cols)
  const col = frame % cols

  const idPrefix = React.useId()

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-slate-900 text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-tight">Sprite Animation</h3>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-4 py-1.5 rounded font-medium transition-colors ${showGrid ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          Grid
        </button>
      </div>

      <div className="flex justify-center items-center bg-slate-950 p-4 border border-slate-800 rounded relative overflow-auto">
        <div
          className="relative overflow-hidden border border-slate-700 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat"
          style={{
            width: frameSize * zoom,
            height: frameSize * zoom,
          }}
        >
          <div
            style={{
              width: frameSize * cols * zoom,
              height: frameSize * rows * zoom,
              backgroundImage: `url(${src})`,
              backgroundSize: `${frameSize * cols * zoom}px ${frameSize * rows * zoom}px`,
              backgroundPosition: `-${col * frameSize * zoom}px -${row * frameSize * zoom}px`,
              imageRendering: 'pixelated',
            }}
          />
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none border border-red-500/50"
              style={{
                boxShadow: `inset 0 0 0 1px rgba(239, 68, 68, 0.5)`
              }}
            />
          )}
        </div>
      </div>

      <AnimationControls
        isPlaying={isPlaying}
        fps={fps}
        currentFrame={frame}
        totalFrames={totalFrames}
        loopMode={loopMode}
        onPlayPause={handlePlayPause}
        onFPSChange={handleFPSChange}
        onFrameChange={handleFrameChange}
        onLoopModeChange={handleLoopModeChange}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-zoom`} className="text-slate-400 text-center">
          Zoom: {zoom}x
        </label>
        <input
          id={`${idPrefix}-zoom`}
          type="range"
          min="1"
          max="10"
          value={zoom}
          onChange={(e) => setZoom(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  )
}

export default SpriteSheetPreview