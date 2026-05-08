'use client'

import { useState, useMemo } from 'react'
import type { Alert } from '@/lib/alert-store'

interface AlertHistoryProps {
  alerts: Alert[]
}

type FilterType = 'all' | 'regression' | 'failure' | 'completion'
type SortOrder = 'desc' | 'asc'

export function AlertHistory({ alerts }: AlertHistoryProps) {
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const filteredAlerts = useMemo(() => {
    let filtered = alerts
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType)
    }
    return [...filtered].sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortOrder === 'desc' ? -diff : diff
    })
  }, [alerts, filterType, sortOrder])

  const severityColors: Record<string, string> = {
    low: 'text-blue-400 border-blue-900/30',
    medium: 'text-yellow-400 border-yellow-900/30',
    high: 'text-orange-400 border-orange-900/30',
    critical: 'text-red-400 border-red-900/30'
  }

  const typeIcons: Record<string, string> = {
    regression: '↓',
    failure: '✕',
    completion: '✓'
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-2xl">✓</span>
          <div>
            <h3 className="text-sm font-medium text-slate-300">No alerts</h3>
            <p className="text-xs text-slate-500">Benchmark is running normally</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold">{alerts.length}</span>
          <span className="text-sm text-slate-400">alert{alerts.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as FilterType)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
          >
            <option value="all">All Types</option>
            <option value="regression">Regression</option>
            <option value="failure">Failure</option>
            <option value="completion">Completion</option>
          </select>
          <button
            onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
          >
            {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`bg-slate-900 p-4 rounded-lg border ${severityColors[alert.severity]}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{typeIcons[alert.type]}</span>
                <div>
                  <div className="text-sm font-medium text-slate-200">
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                  </div>
                  <div className="text-xs text-slate-400">{alert.model_id}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-300">{alert.message}</div>
            {alert.metadata && (
              <div className="mt-2 text-xs text-slate-500">
                Run: {alert.run_id}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}