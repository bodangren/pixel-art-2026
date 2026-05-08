import path from 'path'
import { computeDiffScore } from './visual-diff'
import { getThreshold } from './diff-config'
import type { Run } from './schemas'

export interface RunDiffResult {
  run_id: string
  model_id: string
  diff_scores: {
    background: number
    hero: number
    enemy: number
    effect: number
  }
  regressed: boolean
  diff_overlay_path: string | null
  compared_against_run_id: string | null
  timestamp: string
}

function assetTypeFromKey(key: string): 'background' | 'hero' | 'enemy' | 'effect' {
  const map: Record<string, 'background' | 'hero' | 'enemy' | 'effect'> = {
    background: 'background',
    hero: 'hero',
    enemy: 'enemy',
    effect: 'effect'
  }
  return map[key] || 'effect'
}

export async function computeRunDiff(
  run: Run,
  previousRun: Run | null
): Promise<RunDiffResult> {
  const result: RunDiffResult = {
    run_id: run.run_id,
    model_id: run.model_id,
    diff_scores: { background: 1, hero: 1, enemy: 1, effect: 1 },
    regressed: false,
    diff_overlay_path: null,
    compared_against_run_id: previousRun?.run_id || null,
    timestamp: new Date().toISOString()
  }

  if (!previousRun) return result

  const assetKeys = ['background', 'hero', 'enemy', 'effect'] as const

  for (const key of assetKeys) {
    const currentPath = path.join(process.cwd(), 'public', run.asset_paths[key])
    const previousPath = path.join(process.cwd(), 'public', previousRun.asset_paths[key])

    try {
      const score = await computeDiffScore(currentPath, previousPath)
      result.diff_scores[key] = score

      const threshold = getThreshold(assetTypeFromKey(key))
      if (score < threshold) {
        result.regressed = true
      }
    } catch {
      result.diff_scores[key] = 0
      result.regressed = true
    }
  }

  return result
}

export async function findPreviousRun(modelId: string, variant: string, runs: Run[]): Promise<Run | null> {
  const sameModelRuns = runs
    .filter(r => r.model_id === modelId && r.variant === variant && r.status === 'completed')
    .sort((a, b) => new Date(a.run_date).getTime() - new Date(b.run_date).getTime())

  if (sameModelRuns.length < 2) return null
  return sameModelRuns[sameModelRuns.length - 2]
}

export function hasRegressed(diffResult: RunDiffResult): boolean {
  return diffResult.regressed
}