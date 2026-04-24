'use client'

import React from 'react'
import { BatchResult } from '@/../lib/batch-results'

interface BatchResultsComparisonProps {
  results: BatchResult[]
}

const BatchResultsComparison: React.FC<BatchResultsComparisonProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-500">No batch results to display.</p>
      </div>
    )
  }

  const sortedResults = [...results].sort((a, b) =>
    (b.completed_jobs / b.total_jobs) - (a.completed_jobs / a.total_jobs)
  )

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Batch Results Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 font-medium text-slate-400">Batch ID</th>
              <th className="text-center py-3 px-4 font-medium text-slate-400">Total Jobs</th>
              <th className="text-center py-3 px-4 font-medium text-slate-400">Completed</th>
              <th className="text-center py-3 px-4 font-medium text-slate-400">Failed</th>
              <th className="text-center py-3 px-4 font-medium text-slate-400">Success Rate</th>
              <th className="text-right py-3 px-4 font-medium text-slate-400">Duration</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, idx) => {
              const successRate = result.total_jobs > 0
                ? Math.round((result.completed_jobs / result.total_jobs) * 100)
                : 0

              return (
                <tr key={result.batch_id} className={`border-b border-slate-800 ${idx === 0 ? 'bg-green-950/20' : ''}`}>
                  <td className="py-3 px-4 font-mono text-slate-300">{result.batch_id}</td>
                  <td className="text-center py-3 px-4 font-mono text-white">{result.total_jobs}</td>
                  <td className="text-center py-3 px-4 font-mono text-green-400">{result.completed_jobs}</td>
                  <td className="text-center py-3 px-4 font-mono text-red-400">{result.failed_jobs}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-mono ${successRate >= 80 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {successRate}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 font-mono text-slate-400">
                    {(result.total_duration_ms / 1000).toFixed(1)}s
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Model Performance</h4>
          {Object.entries(results[0].model_stats).map(([model, stats]: [string, { games_completed: number; games_failed: number }]) => (
            <div key={model} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
              <span className="font-mono text-sm text-slate-300">{model}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">{stats.games_completed} done</span>
                {stats.games_failed > 0 && (
                  <span className="text-red-400">{stats.games_failed} failed</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Games Processed</h4>
          <div className="flex flex-wrap gap-2">
            {results[0].games.map(game => (
              <span key={game} className="px-3 py-1 bg-slate-700 rounded-full text-xs font-mono text-slate-300">
                {game}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchResultsComparison