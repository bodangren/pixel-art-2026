import React from 'react';
import { getLeaderboard } from '@/../lib/data';
import Link from 'next/link';

export async function generateStaticParams() {
  return [] // Only one leaderboard page
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-600 tracking-tighter">
            LEADERBOARD
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Game-Asset Model Benchmarking</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase">Sort: Human Score</div>
        </div>
      </div>

      <div className="overflow-x-auto bg-slate-900/40 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/[0.02]">
              <th className="px-6 py-5">Rank</th>
              <th className="px-6 py-5">Model</th>
              <th className="px-6 py-5 text-center">Tech Audit</th>
              <th className="px-6 py-5 text-center">Human Score</th>
              <th className="px-6 py-5 text-right">Runs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leaderboard.length > 0 ? (
              leaderboard.map((model: any, index: number) => (
                <tr key={model.model_id} className="hover:bg-white/[0.03] transition-all group">
                  <td className="px-6 py-6">
                    <span className="font-mono text-slate-600 text-sm">#{index + 1}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <Link href={`/models/${model.model_id}`} className="font-black text-white hover:text-blue-400 transition-colors tracking-tight">
                        {model.model_id}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">Latest: {model.latest_run_date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-bold text-blue-400 text-sm">{model.average_tech_score?.toFixed(1) || '0.0'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center">
                      <span className={`text-2xl font-black tracking-tighter ${model.average_human_score > 0 ? 'text-white' : 'text-slate-800'}`}>
                        {model.average_human_score > 0 ? model.average_human_score.toFixed(1) : '?.?'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="px-2 py-1 bg-white/5 rounded font-mono text-[10px] text-slate-400">{model.run_count}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic font-mono text-sm">
                  Waiting for benchmark data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
