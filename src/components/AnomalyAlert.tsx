'use client'

interface Anomaly {
  value: number
  deviation: number
  direction: 'above' | 'below'
}

interface AnomalyAlertProps {
  anomalies: Anomaly[]
}

export function AnomalyAlert({ anomalies }: AnomalyAlertProps) {
  if (anomalies.length === 0) {
    return (
      <div className="bg-slate-900 p-4 rounded-lg border border-green-900/50">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-sm text-slate-400">No anomalies detected</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-red-900/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400">⚠</span>
        <span className="text-sm font-bold text-red-400">
          {`${anomalies.length} anomaly${anomalies.length > 1 ? 'ies' : ''} detected`}
        </span>
      </div>
      <div className="space-y-1">
        {anomalies.slice(0, 3).map((a, i) => (
          <div key={i} className="text-xs text-slate-400">
            Score {a.value.toFixed(1)} ({a.deviation.toFixed(1)} below threshold)
          </div>
        ))}
        {anomalies.length > 3 && (
          <div className="text-xs text-slate-500">+{anomalies.length - 3} more</div>
        )}
      </div>
    </div>
  )
}