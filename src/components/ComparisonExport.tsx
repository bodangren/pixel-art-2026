'use client'

import React, { useState } from 'react'
import type { Run, Review } from '@/../lib/schemas'
import { toCsv, toJsonExport, downloadFile } from '@/../lib/export'

interface ComparisonExportProps {
  runs: Run[]
  reviews: { runId: string; review: Review | null }[]
}

const ComparisonExport: React.FC<ComparisonExportProps> = ({ runs, reviews }) => {
  const [isOpen, setIsOpen] = useState(false)

  const reviewMap = new Map(reviews.map(r => [r.runId, r.review]))

  const handleExportCSV = () => {
    if (runs.length < 2) {
      alert('Need at least 2 runs for comparison export')
      setIsOpen(false)
      return
    }

    const leftRun = runs[0]
    const rightRun = runs[1]
    const leftReview = reviewMap.get(leftRun.run_id)
    const rightReview = reviewMap.get(rightRun.run_id)

    const rows = [
      {
        metric: 'Model',
        left_model: leftRun.model_id,
        right_model: rightRun.model_id,
        delta: ''
      },
      {
        metric: 'Run Date',
        left_model: leftRun.run_date,
        right_model: rightRun.run_date,
        delta: ''
      },
      {
        metric: 'Human Score',
        left_model: leftReview?.weighted_total_score?.toFixed(2) ?? 'N/A',
        right_model: rightReview?.weighted_total_score?.toFixed(2) ?? 'N/A',
        delta: leftReview && rightReview
          ? (leftReview.weighted_total_score - rightReview.weighted_total_score).toFixed(2)
          : 'N/A'
      },
      {
        metric: 'Background Score',
        left_model: leftReview?.rubric_scores.background?.toFixed(1) ?? 'N/A',
        right_model: rightReview?.rubric_scores.background?.toFixed(1) ?? 'N/A',
        delta: leftReview && rightReview
          ? (leftReview.rubric_scores.background - rightReview.rubric_scores.background).toFixed(1)
          : 'N/A'
      },
      {
        metric: 'Hero Score',
        left_model: leftReview?.rubric_scores.hero?.toFixed(1) ?? 'N/A',
        right_model: rightReview?.rubric_scores.hero?.toFixed(1) ?? 'N/A',
        delta: leftReview && rightReview
          ? (leftReview.rubric_scores.hero - rightReview.rubric_scores.hero).toFixed(1)
          : 'N/A'
      },
      {
        metric: 'Enemy Score',
        left_model: leftReview?.rubric_scores.enemy?.toFixed(1) ?? 'N/A',
        right_model: rightReview?.rubric_scores.enemy?.toFixed(1) ?? 'N/A',
        delta: leftReview && rightReview
          ? (leftReview.rubric_scores.enemy - rightReview.rubric_scores.enemy).toFixed(1)
          : 'N/A'
      },
      {
        metric: 'Effect Score',
        left_model: leftReview?.rubric_scores.effect?.toFixed(1) ?? 'N/A',
        right_model: rightReview?.rubric_scores.effect?.toFixed(1) ?? 'N/A',
        delta: leftReview && rightReview
          ? (leftReview.rubric_scores.effect - rightReview.rubric_scores.effect).toFixed(1)
          : 'N/A'
      },
      {
        metric: 'Pack Score',
        left_model: leftReview?.rubric_scores.pack?.toFixed(1) ?? 'N/A',
        right_model: rightReview?.rubric_scores.pack?.toFixed(1) ?? 'N/A',
        delta: leftReview && rightReview
          ? (leftReview.rubric_scores.pack - rightReview.rubric_scores.pack).toFixed(1)
          : 'N/A'
      }
    ]

    const csv = toCsv(rows)
    downloadFile(csv, `comparison-${leftRun.run_id}-vs-${rightRun.run_id}.csv`, 'text/csv')
    setIsOpen(false)
  }

  const handleExportJSON = () => {
    if (runs.length < 2) {
      alert('Need at least 2 runs for comparison export')
      setIsOpen(false)
      return
    }

    const leftRun = runs[0]
    const rightRun = runs[1]
    const leftReview = reviewMap.get(leftRun.run_id)
    const rightReview = reviewMap.get(rightRun.run_id)

    const comparison = {
      left: {
        model: leftRun.model_id,
        run_date: leftRun.run_date,
        review: leftReview
      },
      right: {
        model: rightRun.model_id,
        run_date: rightRun.run_date,
        review: rightReview
      },
      delta: leftReview && rightReview ? {
        human_score: leftReview.weighted_total_score - rightReview.weighted_total_score,
        background: leftReview.rubric_scores.background - rightReview.rubric_scores.background,
        hero: leftReview.rubric_scores.hero - rightReview.rubric_scores.hero,
        enemy: leftReview.rubric_scores.enemy - rightReview.rubric_scores.enemy,
        effect: leftReview.rubric_scores.effect - rightReview.rubric_scores.effect,
        pack: leftReview.rubric_scores.pack - rightReview.rubric_scores.pack
      } : null
    }

    const json = toJsonExport(comparison, { source: 'comparison_view' })
    downloadFile(json, `comparison-${leftRun.run_id}-vs-${rightRun.run_id}.json`, 'application/json')
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
        Export Comparison
        <span className="text-xs">{isOpen ? '↑' : '↓'}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50">
          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="text-blue-400">CSV</span>
            <span className="text-slate-500 text-xs">With Delta</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="text-emerald-400">JSON</span>
            <span className="text-slate-500 text-xs">Structured</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ComparisonExport