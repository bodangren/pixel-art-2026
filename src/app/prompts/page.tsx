import React from 'react'
import { getAllPrompts } from '@/../lib/prompts'
import PromptHistory from '@/components/PromptHistory'
import { listRuns } from '@/../lib/data'

export default async function PromptsPage() {
  const [prompts, runs] = await Promise.all([
    getAllPrompts('prompts'),
    listRuns()
  ])

  const promptUsageMap = new Map<string, number>()
  for (const run of runs) {
    if (run.prompt_version_id) {
      promptUsageMap.set(
        run.prompt_version_id,
        (promptUsageMap.get(run.prompt_version_id) || 0) + 1
      )
    }
  }

  const promptsWithUsage = prompts.map(p => ({
    ...p.metadata,
    usage_count: promptUsageMap.get(p.metadata.id) || 0
  }))

  const sortedPrompts = [...promptsWithUsage].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Prompt History</h1>
        <p className="text-slate-500 text-sm font-mono">
          Track which prompt versions were used for benchmark runs
        </p>
      </div>

      <div className="mb-8 flex gap-3">
        <span className="px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/30 rounded text-xs font-mono text-[#C5A059]">
          {sortedPrompts.length} prompt versions
        </span>
        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-400">
          {runs.length} runs tracked
        </span>
      </div>

      {sortedPrompts.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 font-mono text-sm">No prompts found</div>
        </div>
      ) : (
        <PromptHistory prompts={sortedPrompts} />
      )}
    </div>
  )
}