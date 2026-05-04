'use client'

import React, { useState } from 'react'
import type { LeaderboardEntry } from '@/../lib/leaderboard'
import { toCsv, toJsonExport, downloadFile } from '@/../lib/export'

interface ExportDropdownProps {
  entries: LeaderboardEntry[]
  label?: string
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ entries, label = 'Export' }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleExportCSV = () => {
    const rows = entries.map((e, i) => ({
      rank: i + 1,
      model: e.model_id,
      runs: e.run_count,
      avg_human_score: e.average_human_score,
      avg_tech_score: e.average_tech_score,
      best_human_score: e.best_human_score,
      latest_run_date: e.latest_run_date
    }))
    const csv = toCsv(rows)
    downloadFile(csv, `leaderboard-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
    setIsOpen(false)
  }

  const handleExportJSON = () => {
    const json = toJsonExport(entries, { source: 'leaderboard' })
    downloadFile(json, `leaderboard-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <span className="text-xs">{isOpen ? '↑' : '↓'}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50">
          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="text-blue-400">CSV</span>
            <span className="text-slate-500 text-xs">Spreadsheet</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="text-emerald-400">JSON</span>
            <span className="text-slate-500 text-xs">Data</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ExportDropdown