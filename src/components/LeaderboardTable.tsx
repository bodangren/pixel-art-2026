'use client'

import React from 'react'
import Link from 'next/link'
import type { LeaderboardEntry } from '@/../lib/leaderboard'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  onModelClick: (modelId: string) => void
  currentSort?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  onModelClick,
  currentSort = 'average_human_score',
  sortOrder = 'desc',
  onSort
}) => {
  const handleHeaderClick = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  const renderSortIcon = (key: string) => {
    if (currentSort !== key) return <span className="text-slate-600 ml-1">↕</span>
    return sortOrder === 'desc' ? <span className="text-blue-400 ml-1">↓</span> : <span className="text-blue-400 ml-1">↑</span>
  }

  if (entries.length === 0) {
    return (
      <div className="overflow-x-auto bg-slate-900/40 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic font-mono text-sm">
                Waiting for benchmark data...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-slate-900/40 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/[0.02]">
            <th className="px-6 py-5">Rank</th>
            <th className="px-6 py-5">Model</th>
            <th
              className="px-6 py-5 text-center cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleHeaderClick('average_tech_score')}
            >
              Tech Score{renderSortIcon('average_tech_score')}
            </th>
            <th
              className="px-6 py-5 text-center cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleHeaderClick('average_human_score')}
            >
              Human Score{renderSortIcon('average_human_score')}
            </th>
            <th
              className="px-6 py-5 text-right cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleHeaderClick('run_count')}
            >
              Runs{renderSortIcon('run_count')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {entries.map((model, index) => (
            <tr
              key={model.model_id}
              className="hover:bg-white/[0.03] transition-all group cursor-pointer"
              onClick={() => onModelClick(model.model_id)}
            >
              <td className="px-6 py-6">
                <span className="font-mono text-slate-600 text-sm">#{index + 1}</span>
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-col">
                  <Link
                    href={`/models/${model.model_id}`}
                    className="font-black text-white hover:text-blue-400 transition-colors tracking-tight"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {model.model_id}
                  </Link>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">Latest: {model.latest_run_date}</span>
                </div>
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono font-bold text-blue-400 text-sm">{model.average_tech_score.toFixed(1)}</span>
                </div>
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-col items-center">
                  <span className={`text-2xl font-black tracking-tighter ${model.average_human_score > 0 ? 'text-white' : 'text-slate-800'}`}>
                    {model.average_human_score > 0 ? model.average_human_score.toFixed(1) : '?.?'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 text-right">
                <span className="px-2 py-1 bg-white/5 rounded font-mono text-[10px] text-slate-400">{model.run_count}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardTable