'use client'

import React, { useState } from 'react'
import type { LeaderboardFilters as FilterType } from '@/../lib/leaderboard'

interface LeaderboardFiltersProps {
  onFilterChange: (filters: FilterType) => void
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({ onFilterChange }) => {
  const [minRuns, setMinRuns] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleChange = () => {
    onFilterChange({
      minRuns: minRuns ? parseInt(minRuns) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    })
  }

  const handleReset = () => {
    setMinRuns('')
    setStartDate('')
    setEndDate('')
    onFilterChange({})
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-slate-900/40 rounded-2xl border border-white/5">
      <div className="flex flex-col gap-1">
        <label htmlFor="minRuns" className="text-[10px] font-bold text-slate-500 uppercase">
          Min Runs
        </label>
        <input
          id="minRuns"
          type="number"
          min="1"
          value={minRuns}
          onChange={(e) => {
            setMinRuns(e.target.value)
            handleChange()
          }}
          className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm font-mono w-24 focus:outline-none focus:border-blue-500"
          placeholder="1"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="startDate" className="text-[10px] font-bold text-slate-500 uppercase">
          Start Date
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value)
            handleChange()
          }}
          className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="endDate" className="text-[10px] font-bold text-slate-500 uppercase">
          End Date
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value)
            handleChange()
          }}
          className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-slate-400 text-sm font-bold hover:bg-slate-700 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default LeaderboardFilters