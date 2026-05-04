'use client'

import React, { useState } from 'react'
import { downloadFile } from '@/../lib/export'

interface ExportButtonProps {
  exportType: 'csv' | 'json' | 'both'
  data?: unknown[]
  filename?: string
  label?: string
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportType,
  data = [],
  filename,
  label = 'Export'
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      setIsOpen(false)
      return
    }
    const headers = Object.keys(data[0] as Record<string, unknown>)
    const rows = data.map(item =>
      headers.map(h => {
        const val = (item as Record<string, unknown>)[h]
        const str = String(val ?? '')
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const csvFilename = filename || `export-${new Date().toISOString().split('T')[0]}.csv`
    downloadFile(csv, csvFilename, 'text/csv')
    setIsOpen(false)
  }

  const handleExportJSON = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      setIsOpen(false)
      return
    }
    const payload = {
      timestamp: new Date().toISOString(),
      data
    }
    const json = JSON.stringify(payload, null, 2)
    const jsonFilename = filename || `export-${new Date().toISOString().split('T')[0]}.json`
    downloadFile(json, jsonFilename, 'application/json')
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
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50">
          {(exportType === 'csv' || exportType === 'both') && (
            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-blue-400">CSV</span>
              <span className="text-slate-500 text-xs">Spreadsheet</span>
            </button>
          )}
          {(exportType === 'json' || exportType === 'both') && (
            <button
              onClick={handleExportJSON}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-emerald-400">JSON</span>
              <span className="text-slate-500 text-xs">Data</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ExportButton