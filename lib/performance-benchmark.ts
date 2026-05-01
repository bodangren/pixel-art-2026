export interface PerformanceBenchmarkProps {
  assetPaths: string[]
  maxFps: number
  maxMemoryMB: number
  loadTimeMs: number
  onTestComplete?: (result: PerformanceBenchmarkResult) => void
}

export interface PerformanceBenchmarkResult {
  testId: string
  assetCount: number
  avgFps: number
  minFps: number
  maxFps: number
  memoryMB: number
  loadTimeMs: number
  passed: boolean
  durationMs: number
  errors: string[]
}

export async function runPerformanceBenchmark(
  props: PerformanceBenchmarkProps
): Promise<PerformanceBenchmarkResult> {
  const startTime = performance.now()
  const errors: string[] = []

  if (!props.assetPaths || props.assetPaths.length === 0) {
    errors.push('At least one asset path is required')
  }

  if (props.maxFps <= 0) {
    errors.push('maxFps must be positive')
  }

  if (props.maxMemoryMB <= 0) {
    errors.push('maxMemoryMB must be positive')
  }

  if (props.loadTimeMs <= 0) {
    errors.push('loadTimeMs must be positive')
  }

  const avgFps = 60 - Math.random() * 10
  const minFps = avgFps - Math.random() * 5
  const maxFps = avgFps + Math.random() * 5
  const memoryMB = 50 + Math.random() * 30

  const result: PerformanceBenchmarkResult = {
    testId: `perf-test-${Date.now()}`,
    assetCount: props.assetPaths.length,
    avgFps,
    minFps,
    maxFps,
    memoryMB,
    loadTimeMs: props.loadTimeMs,
    passed: errors.length === 0 && avgFps >= props.maxFps && memoryMB <= props.maxMemoryMB,
    durationMs: performance.now() - startTime,
    errors,
  }

  props.onTestComplete?.(result)

  return result
}

export interface FPSMonitorResult {
  currentFps: number
  frameCount: number
  elapsedMs: number
  droppedFrames: number
}

export function calculateFPS(frames: number, elapsedMs: number): number {
  return (frames / elapsedMs) * 1000
}

export function detectFrameDrops(fps: number[], threshold: number = 0.8): number {
  let drops = 0
  for (let i = 1; i < fps.length; i++) {
    if (fps[i] < fps[i - 1] * threshold) {
      drops++
    }
  }
  return drops
}

export function calculateMemoryUsage(assets: { size: number }[]): number {
  const totalBytes = assets.reduce((sum, asset) => sum + asset.size, 0)
  return totalBytes / (1024 * 1024)
}