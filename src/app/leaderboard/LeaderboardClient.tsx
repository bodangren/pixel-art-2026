'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import LeaderboardTable from '@/components/LeaderboardTable'
import LeaderboardFilters from '@/components/LeaderboardFilters'
import ModelDetailPanel from '@/components/ModelDetailPanel'
import type { LeaderboardEntry, LeaderboardFilters as FilterType } from '@/../lib/leaderboard'
import type { Run } from '@/../lib/schemas'

interface LeaderboardClientProps {
  initialEntries: LeaderboardEntry[]
  allRuns: Run[]
}

const LeaderboardClient: React.FC<LeaderboardClientProps> = ({ initialEntries, allRuns }) => {
  const [entries, setEntries] = useState(initialEntries)
  const [currentSort, setCurrentSort] = useState<string>('average_human_score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedModel, setSelectedModel] = useState<LeaderboardEntry | null>(null)
  const [modelRuns, setModelRuns] = useState<Run[]>([])

  const handleFilterChange = (newFilters: FilterType) => {
    let filtered = [...initialEntries]

    if (newFilters.minRuns !== undefined) {
      filtered = filtered.filter(e => e.run_count >= newFilters.minRuns!)
    }
    if (newFilters.startDate) {
      filtered = filtered.filter(e => e.latest_run_date >= newFilters.startDate!)
    }
    if (newFilters.endDate) {
      filtered = filtered.filter(e => e.latest_run_date <= newFilters.endDate!)
    }

    filtered.sort((a, b) => {
      const aVal = a[currentSort as keyof LeaderboardEntry]
      const bVal = b[currentSort as keyof LeaderboardEntry]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal)
      }
      return sortOrder === 'desc'
        ? (Number(bVal) || 0) - (Number(aVal) || 0)
        : (Number(aVal) || 0) - (Number(bVal) || 0)
    })

    setEntries(filtered)
  }

  const handleSort = (key: string) => {
    if (currentSort === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setCurrentSort(key)
      setSortOrder('desc')
    }

    const newOrder = currentSort === key ? (sortOrder === 'desc' ? 'asc' : 'desc') : 'desc'

    const sorted = [...entries].sort((a, b) => {
      const aVal = a[key as keyof LeaderboardEntry]
      const bVal = b[key as keyof LeaderboardEntry]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return newOrder === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal)
      }
      return newOrder === 'desc'
        ? (Number(bVal) || 0) - (Number(aVal) || 0)
        : (Number(aVal) || 0) - (Number(bVal) || 0)
    })

    setEntries(sorted)
  }

  const handleModelClick = (modelId: string) => {
    const entry = initialEntries.find(e => e.model_id === modelId)
    const runs = allRuns.filter(r => r.model_id === modelId)
    setSelectedModel(entry || null)
    setModelRuns(runs)
  }

  const handleClosePanel = () => {
    setSelectedModel(null)
    setModelRuns([])
  }

  return (
    <>
      <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen font-sans">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-600 tracking-tighter">
              LEADERBOARD
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Game-Asset Model Benchmarking</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase">
              Sort: {currentSort === 'average_human_score' ? 'Human Score' : currentSort === 'average_tech_score' ? 'Tech Score' : currentSort === 'run_count' ? 'Runs' : 'Name'}
            </div>
          </div>
        </div>

        <LeaderboardFilters onFilterChange={handleFilterChange} />

        <Link href="/">
          <span className="text-blue-400 text-xs font-mono uppercase tracking-widest hover:text-blue-300 transition-colors">
            ← Back to Home
          </span>
        </Link>

        <div className="mt-8">
          <LeaderboardTable
            entries={entries}
            onModelClick={handleModelClick}
            currentSort={currentSort}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      </div>

      {selectedModel && (
        <ModelDetailPanel
          entry={selectedModel}
          runs={modelRuns}
          onClose={handleClosePanel}
        />
      )}
    </>
  )
}

export default LeaderboardClient