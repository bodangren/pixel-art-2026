import React from 'react';
import { listRuns, getReview } from '@/../lib/data';
import ComparisonView from '@/components/ComparisonView';
import ComparisonExport from '@/components/ComparisonExport';
import Link from 'next/link';

interface ComparePageProps {
  searchParams: Promise<{ prompt?: string }>
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { prompt: promptFilter } = await searchParams;
  const runs = await listRuns();

  let sortedRuns = [...runs].sort((a, b) =>
    new Date(b.run_date).getTime() - new Date(a.run_date).getTime()
  );

  if (promptFilter) {
    sortedRuns = sortedRuns.filter(run =>
      run.prompt_version_id === promptFilter || run.prompt_version === promptFilter
    );
  }

  const runsWithReviews = await Promise.all(
    sortedRuns.map(async (run) => {
      const review = await getReview(run.run_id);
      return { run, review };
    })
  );

  if (runs.length < 2) {
    return (
      <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-slate-500 font-mono text-sm">Need at least 2 runs to compare</div>
          <Link href="/" className="text-blue-400 text-xs font-mono uppercase tracking-widest hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const promptVersions = [...new Set(runs.map(r => r.prompt_version_id || r.prompt_version).filter(Boolean))];

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Compare Models</h1>
          <p className="text-slate-500 text-sm font-mono">Side-by-side asset comparison with synchronized zoom</p>
        </div>
        <div className="flex gap-4 items-center">
          {promptVersions.length > 1 && (
            <form method="get" action="/compare" className="flex items-center gap-2">
              <label htmlFor="prompt-filter" className="text-xs font-mono text-slate-500">Prompt:</label>
              <select
                id="prompt-filter"
                name="prompt"
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
                defaultValue={promptFilter || ''}
              >
                <option value="">All prompts</option>
                {promptVersions.map(pv => (
                  <option key={pv} value={pv}>{pv}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono hover:bg-slate-700"
              >
                Filter
              </button>
              {promptFilter && (
                <Link href="/compare" className="px-2 py-1 text-xs font-mono text-slate-400 hover:text-white">
                  Clear
                </Link>
              )}
            </form>
          )}
          <ComparisonExport
            runs={sortedRuns}
            reviews={runsWithReviews.map(r => ({ runId: r.run.run_id, review: r.review }))}
          />
        </div>
      </div>
      {sortedRuns.length < 2 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-slate-500 font-mono text-sm">No runs match the selected prompt filter</div>
          <Link href="/compare" className="text-blue-400 text-xs font-mono uppercase tracking-widest hover:text-blue-300">
            Clear filter
          </Link>
        </div>
      ) : (
        <ComparisonView
          runs={sortedRuns}
          initialLeftRunId={sortedRuns[0]?.run_id || ''}
          initialRightRunId={sortedRuns[1]?.run_id || ''}
          assetKey="hero"
          initialReviews={runsWithReviews.map(r => ({ runId: r.run.run_id, review: r.review }))}
        />
      )}
    </div>
  );
}