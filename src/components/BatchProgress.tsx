'use client'

import React from 'react'
import { BatchProgress as BatchProgressType } from '@/lib/batch'

interface BatchProgressProps {
  progress: BatchProgressType
  totalJobs: number
}

const statusColors = {
  pending: 'bg-slate-600',
  running: 'bg-blue-500 animate-pulse',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-slate-400'
}

const statusLabels = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
}

const BatchProgress: React.FC<BatchProgressProps> = ({ progress, totalJobs }) => {
  const percentage = totalJobs > 0 ? Math.round(((progress.completed + progress.failed) / totalJobs) * 100) : 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Batch Progress</h3>
        <span className="text-lg font-mono font-bold text-white">{percentage}%</span>
      </div>

      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {(['pending', 'running', 'completed', 'failed', 'cancelled'] as const).map(status => (
          <div key={status} className="flex flex-col items-center p-3 rounded-lg bg-slate-800/50">
            <div className={`w-3 h-3 rounded-full ${statusColors[status]} mb-2`} />
            <span className="text-lg font-mono font-bold text-white">
              {progress[status]}
            </span>
            <span className="text-xs text-slate-500">{statusLabels[status]}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-slate-500">
        <span>Total: <span className="font-mono text-white">{totalJobs}</span></span>
        <span>
          Done: <span className="font-mono text-white">{progress.completed + progress.failed}</span>
          {progress.failed > 0 && (
            <span className="text-red-400 ml-2">({progress.failed} failed)</span>
          )}
        </span>
      </div>
    </div>
  )
}

export default BatchProgress