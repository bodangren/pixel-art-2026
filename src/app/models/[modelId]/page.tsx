import React from 'react';
import { listRuns, getLeaderboard } from '@/../lib/data';
import Link from 'next/link';

export async function generateStaticParams() {
  const leaderboard = await getLeaderboard();
  return leaderboard.map((model: any) => ({
    modelId: model.model_id,
  }));
}

export default async function ModelPage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const allRuns = await listRuns();
  const modelRuns = allRuns.filter(run => run.model_id === modelId)
    .sort((a, b) => new Date(b.run_date).getTime() - new Date(a.run_date).getTime());
  
  const leaderboard = await getLeaderboard();
  const modelStats = leaderboard.find((m: any) => m.model_id === modelId);

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="mb-12">
        <Link href="/leaderboard" className="text-blue-400 text-xs font-mono uppercase tracking-widest hover:text-blue-300 transition-colors">
          ← Back to Leaderboard
        </Link>
        <h1 className="text-5xl font-black mt-4 tracking-tighter uppercase">{modelId}</h1>
        <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">Model Performance History</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total Runs</div>
          <div className="text-3xl font-black">{modelRuns.length}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Tech Score</div>
          <div className="text-3xl font-black text-blue-400">N/A</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Human Score</div>
          <div className="text-3xl font-black text-emerald-400">{modelStats?.average_human_score > 0 ? modelStats.average_human_score.toFixed(1) : 'N/A'}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Latest Run</div>
          <div className="text-sm font-black text-amber-500">{modelRuns[0]?.run_date}</div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-6 text-slate-400 uppercase tracking-widest text-xs border-b border-white/5 pb-2">Run History</h2>
        <div className="space-y-4">
          {modelRuns.map((run) => (
            <Link 
              key={run.run_id}
              href={`/runs/${run.run_id}`}
              className="flex items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500">{run.run_date}</span>
                  <span className="font-bold group-hover:text-blue-400 transition-colors">{run.run_id}</span>
                </div>
                <div className="hidden md:flex gap-2">
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 uppercase font-bold">{run.variant}</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-blue-500 transition-colors">
                  <span className="text-white">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
