'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import type { Run } from '@/../lib/schemas'
import { getAllTemplates, type GameTemplate } from '@/../lib/game-templates'

interface GameCanvasProps {
  runs: Run[]
  initialRunId: string
  initialTemplateId?: string
}

interface SpriteSheet {
  image: HTMLImageElement
  width: number
  height: number
  columns: number
  rows: number
}

type AnimationState = 'idle' | 'walk' | 'attack'

interface AnimatedSprite {
  sheet: SpriteSheet
  currentFrame: number
  frameCount: number
  fps: number
  lastUpdate: number
  state: AnimationState
}

const ANIMATION_STATES: AnimationState[] = ['idle', 'walk', 'attack']
const STATE_ROWS: Record<AnimationState, number> = {
  idle: 0,
  walk: 1,
  attack: 2
}

const SPRITE_SIZE = 48
const DEFAULT_CANVAS_WIDTH = 640
const DEFAULT_CANVAS_HEIGHT = 480
const SCALE = 2

function extractFrames(image: HTMLImageElement): { columns: number; rows: number } {
  const width = image.width
  const height = image.height
  const columns = Math.floor(width / SPRITE_SIZE)
  const rows = Math.floor(height / SPRITE_SIZE)
  return { columns, rows }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default function GameCanvas({ runs, initialRunId, initialTemplateId = 'labyrinth' }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const spritesRef = useRef<Map<string, SpriteSheet>>(new Map())
  const animatedSpritesRef = useRef<Map<string, AnimatedSprite>>(new Map())
  const backgroundRef = useRef<HTMLImageElement | null>(null)

  const [selectedRunId, setSelectedRunId] = useState(initialRunId)
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId)
  const [loading, setLoading] = useState(true)
  const [fps, setFps] = useState(4)
  const [showGrid, setShowGrid] = useState(false)
  const [animationState, setAnimationState] = useState<AnimationState>('idle')
  const [isPaused, setIsPaused] = useState(false)

  const selectedRun = runs.find(r => r.run_id === selectedRunId)
  const selectedTemplate: GameTemplate | undefined = getAllTemplates().find(t => t.id === selectedTemplateId)
  const bgColor = selectedTemplate?.renderConfig.backgroundColor || '#1a1a2e'
  const canvasWidth = selectedTemplate?.tilemapConfig.canvasWidth || DEFAULT_CANVAS_WIDTH
  const canvasHeight = selectedTemplate?.tilemapConfig.canvasHeight || DEFAULT_CANVAS_HEIGHT

  const [heroX, setHeroX] = useState(canvasWidth / 2)
  const [heroY, setHeroY] = useState(canvasHeight / 2)

  const loadSprites = useCallback(async (run: Run) => {
    setLoading(true)
    const basePath = `/data/runs/${run.run_id}/`

    try {
      const heroImg = await loadImage(basePath + run.asset_paths.hero)
      const heroSheet = { image: heroImg, width: heroImg.width, height: heroImg.height, ...extractFrames(heroImg) }
      spritesRef.current.set('hero', heroSheet)

      const bgImg = await loadImage(basePath + run.asset_paths.background)
      backgroundRef.current = bgImg

      const heroAnim: AnimatedSprite = {
        sheet: heroSheet,
        currentFrame: 0,
        frameCount: heroSheet.columns,
        fps,
        lastUpdate: performance.now(),
        state: 'idle'
      }
      animatedSpritesRef.current.set('hero', heroAnim)

      setLoading(false)
    } catch (err) {
      console.error('Failed to load sprites:', err)
      setLoading(false)
    }
  }, [fps])

  useEffect(() => {
    if (!selectedRun) return

    setTimeout(() => {
      loadSprites(selectedRun)
    }, 0)
  }, [selectedRun, loadSprites])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const context = ctx as CanvasRenderingContext2D
    context.imageSmoothingEnabled = false

    function render(timestamp: number) {
      context.clearRect(0, 0, canvasWidth, canvasHeight)

      context.fillStyle = bgColor
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      const bg = backgroundRef.current
      if (bg) {
        const tileWidth = bg.width * SCALE
        const tileHeight = bg.height * SCALE
        for (let y = 0; y < canvasHeight; y += tileHeight) {
          for (let x = 0; x < canvasWidth; x += tileWidth) {
            context.drawImage(bg, x, y, tileWidth, tileHeight)
          }
        }
      }

      const heroAnim = animatedSpritesRef.current.get('hero')
      if (heroAnim) {
        heroAnim.fps = fps

        if (!isPaused && timestamp - heroAnim.lastUpdate > 1000 / fps) {
          heroAnim.currentFrame = (heroAnim.currentFrame + 1) % heroAnim.frameCount
          heroAnim.lastUpdate = timestamp
        }

        const { image, columns } = heroAnim.sheet
        const col = heroAnim.currentFrame % columns
        const row = STATE_ROWS[animationState]
        const srcX = col * SPRITE_SIZE
        const srcY = row * SPRITE_SIZE

        const destX = heroX - (SPRITE_SIZE * SCALE) / 2
        const destY = heroY - (SPRITE_SIZE * SCALE) / 2

        context.drawImage(
          image,
          srcX, srcY, SPRITE_SIZE, SPRITE_SIZE,
          destX, destY, SPRITE_SIZE * SCALE, SPRITE_SIZE * SCALE
        )

        if (showGrid) {
          context.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          context.lineWidth = 1
          context.strokeRect(destX, destY, SPRITE_SIZE * SCALE, SPRITE_SIZE * SCALE)

          for (let i = 1; i < 3; i++) {
            context.beginPath()
            context.moveTo(destX + i * (SPRITE_SIZE * SCALE) / 3, destY)
            context.lineTo(destX + i * (SPRITE_SIZE * SCALE) / 3, destY + SPRITE_SIZE * SCALE)
            context.stroke()
            context.beginPath()
            context.moveTo(destX, destY + i * (SPRITE_SIZE * SCALE) / 3)
            context.lineTo(destX + SPRITE_SIZE * SCALE, destY + i * (SPRITE_SIZE * SCALE) / 3)
            context.stroke()
          }
        }
      }

      if (showGrid) {
        context.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        context.lineWidth = 1
        for (let x = 0; x < canvasWidth; x += SPRITE_SIZE * SCALE) {
          context.beginPath()
          context.moveTo(x, 0)
          context.lineTo(x, canvasHeight)
          context.stroke()
        }
        for (let y = 0; y < canvasHeight; y += SPRITE_SIZE * SCALE) {
          context.beginPath()
          context.moveTo(0, y)
          context.lineTo(canvasWidth, y)
          context.stroke()
        }
      }

      animationRef.current = requestAnimationFrame(render)
    }

    animationRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [fps, showGrid, heroX, heroY, animationState, isPaused, bgColor, canvasWidth, canvasHeight])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setHeroX(x)
    setHeroY(y)
  }, [])

  const templates = getAllTemplates()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Run:
          <select
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700 text-sm"
          >
            {runs.map(run => (
              <option key={run.run_id} value={run.run_id}>
                {run.model_id} ({run.run_date})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Template:
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700 text-sm"
          >
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          FPS:
          <input
            type="range"
            min="1"
            max="12"
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-center text-white">{fps}</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="w-4 h-4"
          />
          Show Grid
        </label>

        <button
          onClick={() => setIsPaused(p => !p)}
          className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded"
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Animation:
          <select
            value={animationState}
            onChange={(e) => setAnimationState(e.target.value as AnimationState)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700 text-sm"
          >
            {ANIMATION_STATES.map(state => (
              <option key={state} value={state}>
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => selectedRun && loadSprites(selectedRun)}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded"
        >
          Reload Assets
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          className="border border-slate-700 rounded cursor-crosshair"
          style={{ imageSmoothingEnabled: false } as React.CSSProperties}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded">
            <span className="text-white font-mono text-sm">Loading sprites...</span>
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500">
        Click on canvas to move hero sprite | Sprites: {SPRITE_SIZE}x{SPRITE_SIZE}px | Scale: {SCALE}x
      </div>
    </div>
  )
}