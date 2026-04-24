'use client'

import React from 'react'
import { BatchJob } from '@/../lib/batch'

interface FailureReportProps {
  failedJobs: BatchJob[]
}

const FailureReport: React.FC<FailureReportProps> = ({ failedJobs }) => {
  if (failedJobs.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 text-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold">No Failures</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">All jobs completed successfully.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-red-900/50 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 text-red-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-bold">{failedJobs.length} Failed {failedJobs.length === 1 ? 'Job' : 'Jobs'}</span>
      </div>

      <div className="space-y-3">
        {failedJobs.map(job => (
          <div key={job.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-sm text-slate-300">{job.game_slug}</span>
                <span className="mx-2 text-slate-600">/</span>
                <span className="font-mono text-sm text-slate-400">{job.model_id}</span>
              </div>
              <span className="text-xs text-slate-500">
                Retries: {job.retry_count}
              </span>
            </div>
            <p className="mt-2 text-sm text-red-300">{job.error}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FailureReport