import React from 'react';
import { listRuns } from '@/../lib/data';
import Link from 'next/link';

export default async function HomePage() {
  const runs = await listRuns();

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Pixel Art Benchmark
        </h1>
        <Link 
          href="/leaderboard"
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-bold shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform"
        >
          View Leaderboard
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-6 text-slate-400 uppercase tracking-widest">Recent Benchmark Runs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {runs.map((run) => (
            <Link 
              key={run.run_id} 
              href={`/runs/${run.run_id}`}
              className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all hover:bg-slate-800/50"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-400">{run.run_date}</span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  run.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                  {run.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">{run.model_id}</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">{run.run_id}</p>
              
              <div className="grid grid-cols-4 gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {Object.keys(run.asset_paths).map((asset) => (
                  <div key={asset} className="h-1 rounded-full bg-blue-500" title={asset} />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
