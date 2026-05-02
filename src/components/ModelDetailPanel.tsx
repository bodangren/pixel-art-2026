'use client'

import React from 'react'
import Link from 'next/link'
import type { LeaderboardEntry } from '@/../lib/leaderboard'
import type { Run } from '@/../lib/schemas'

interface ModelDetailPanelProps {
  entry: LeaderboardEntry
  runs: Run[]
  onClose: () => void
}

const ModelDetailPanel: React.FC<ModelDetailPanelProps> = ({ entry, runs, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{entry.model_id}</h2>
              <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">Model Details</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-slate-400 text-sm font-bold hover:bg-slate-700 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total Runs</div>
            <div className="text-2xl font-black text-white">{entry.run_count}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Tech Score</div>
            <div className="text-2xl font-black text-blue-400">{entry.average_tech_score.toFixed(1)}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Human Score</div>
            <div className="text-2xl font-black text-emerald-400">{entry.average_human_score > 0 ? entry.average_human_score.toFixed(1) : 'N/A'}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Best Score</div>
            <div className="text-2xl font-black text-amber-400">{entry.best_human_score > 0 ? entry.best_human_score.toFixed(1) : 'N/A'}</div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Run History</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {runs.map((run) => (
              <Link
                key={run.run_id}
                href={`/runs/${run.run_id}`}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/60 transition-colors group"
                onClick={onClose}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-white group-hover:text-blue-400">{run.run_id}</span>
                  <span className="text-xs text-slate-500 font-mono">{run.run_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-700 rounded text-[10px] text-slate-400 uppercase font-bold">{run.variant}</span>
                  <span className="text-slate-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelDetailPanel