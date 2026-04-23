import React from 'react';
import { listRuns, getReview } from '@/../lib/data';
import ComparisonView from '@/components/ComparisonView';
import Link from 'next/link';

export default async function ComparePage() {
  const runs = await listRuns();
  const sortedRuns = [...runs].sort((a, b) =>
    new Date(b.run_date).getTime() - new Date(a.run_date).getTime()
  );

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

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Compare Models</h1>
        <p className="text-slate-500 text-sm font-mono">Side-by-side asset comparison with synchronized zoom</p>
      </div>
      <ComparisonView
        runs={sortedRuns}
        initialLeftRunId={sortedRuns[0]?.run_id || ''}
        initialRightRunId={sortedRuns[1]?.run_id || ''}
        assetKey="hero"
        initialReviews={runsWithReviews.map(r => ({ runId: r.run.run_id, review: r.review }))}
      />
    </div>
  );
}