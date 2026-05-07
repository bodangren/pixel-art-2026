'use client'

import React from 'react'

interface PromptVersion {
  id: string
  version: string
  created_at: string
  content_hash: string
  description?: string
  usage_count: number
}

interface PromptHistoryProps {
  prompts: PromptVersion[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function PromptHistory({ prompts }: PromptHistoryProps) {
  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="px-2 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded text-xs font-bold">
                {prompt.version}
              </span>
              <h3 className="text-lg font-bold mt-2">{prompt.id}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[#C5A059]">
                {prompt.usage_count}
              </div>
              <div className="text-xs text-slate-500">runs</div>
            </div>
          </div>

          {prompt.description && (
            <p className="text-sm text-slate-400 mb-4">{prompt.description}</p>
          )}

          <div className="flex gap-4 text-xs font-mono text-slate-500">
            <span>Created: {formatDate(prompt.created_at)}</span>
            <span className="text-slate-600">|</span>
            <span className="truncate" title={prompt.content_hash}>
              hash: {prompt.content_hash.slice(0, 12)}...
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}