'use client'

interface DiffScore {
  background: number
  hero: number
  enemy: number
  effect: number
}

interface RegressionAlertProps {
  diffScores: DiffScore
  comparedAgainstRunId: string | null
}

const assetLabels: Record<keyof DiffScore, string> = {
  background: 'Background',
  hero: 'Hero',
  enemy: 'Enemy',
  effect: 'Effect'
}

const thresholds: Record<keyof DiffScore, number> = {
  background: 0.95,
  hero: 0.90,
  enemy: 0.90,
  effect: 0.90
}

function getRegressedAssets(diffScores: DiffScore): Array<{ asset: keyof DiffScore; score: number; threshold: number }> {
  const regressed: Array<{ asset: keyof DiffScore; score: number; threshold: number }> = []
  for (const [asset, score] of Object.entries(diffScores) as [keyof DiffScore, number][]) {
    if (score < thresholds[asset]) {
      regressed.push({ asset, score, threshold: thresholds[asset] })
    }
  }
  return regressed
}

export function RegressionAlert({ diffScores, comparedAgainstRunId }: RegressionAlertProps) {
  const regressedAssets = getRegressedAssets(diffScores)

  if (regressedAssets.length === 0) {
    return (
      <div className="bg-slate-900 p-4 rounded-lg border border-green-900/50">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-sm text-slate-400">No regression detected</span>
        </div>
        {comparedAgainstRunId && (
          <div className="text-xs text-slate-600 mt-1">
            Compared against {comparedAgainstRunId}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-amber-900/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-400">⚠</span>
        <span className="text-sm font-bold text-amber-400">
          Regression detected ({regressedAssets.length} asset{regressedAssets.length > 1 ? 's' : ''})
        </span>
      </div>
      <div className="space-y-1">
        {regressedAssets.map(({ asset, score, threshold }) => (
          <div key={asset} className="text-xs text-slate-400">
            {assetLabels[asset]}: {score.toFixed(3)} (threshold: {threshold})
          </div>
        ))}
      </div>
      {comparedAgainstRunId && (
        <div className="text-xs text-slate-600 mt-2">
          vs. {comparedAgainstRunId}
        </div>
      )}
    </div>
  )
}