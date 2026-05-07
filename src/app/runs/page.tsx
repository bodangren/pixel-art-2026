import React from 'react';
import { listRuns, getValidationStatus } from '@/../lib/data';
import Link from 'next/link';

export default async function RunsPage() {
  const [runs, validationStatus] = await Promise.all([
    listRuns(),
    getValidationStatus()
  ]);
  const sortedRuns = [...runs].sort((a, b) =>
    new Date(b.run_date).getTime() - new Date(a.run_date).getTime()
  );

  const totalRuns = sortedRuns.length;
  const passedRuns = Object.values(validationStatus).filter(v => v.passed).length;
  const failedRuns = totalRuns - passedRuns;

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Asset Gallery</h1>
          <p className="text-slate-500 text-sm font-mono">Browse all benchmark runs and generated assets</p>
        </div>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-green-900/30 border border-green-700 rounded text-xs font-mono text-green-400">
            ✓ {passedRuns} validated
          </span>
          <span className="px-3 py-1 bg-red-900/30 border border-red-700 rounded text-xs font-mono text-red-400">
            ✗ {failedRuns} failed
          </span>
        </div>
      </div>

      {sortedRuns.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 font-mono text-sm">No benchmark runs yet</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRuns.map((run) => {
            const validation = validationStatus[run.run_id];
            const isValidated = validation?.passed ?? null;
            return (
              <Link
                key={run.run_id}
                href={`/runs/${run.run_id}`}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all hover:bg-slate-800/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-400">{run.run_date}</span>
                  <div className="flex gap-1">
                    {isValidated === false && (
                      <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded text-[10px] font-bold" title={validation.issues.join(', ')}>
                        INVALID
                      </span>
                    )}
                    {isValidated === true && (
                      <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-[10px] font-bold" title="Assets validated">
                        VALID
                      </span>
                    )}
                    {isValidated === null && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-[10px] font-bold">
                        UNVALIDATED
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">{run.model_id}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">{run.run_id}</p>

                <div className="grid grid-cols-4 gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {Object.keys(run.asset_paths).map((asset) => (
                    <div key={asset} className="h-1 rounded-full bg-blue-500" title={asset} />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}