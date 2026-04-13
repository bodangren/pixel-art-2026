import React from 'react';
import { getRun, listRuns, getReview } from '@/../lib/data';
import AssetGallery from '@/components/AssetGallery';
import ReviewSection from '@/components/ReviewSection';

export async function generateStaticParams() {
  const runs = await listRuns();
  return runs.map((run) => ({
    runId: run.run_id,
  }));
}

export default async function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRun(runId);
  const review = await getReview(runId);

  const reviewMode = process.env.NEXT_PUBLIC_REVIEW_MODE === 'true';

  return (
    <div className="container mx-auto p-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Run: {run.run_id}</h1>
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span>Model: <b className="text-blue-400">{run.model_id}</b></span>
            <span>Date: <b>{run.run_date}</b></span>
            <span>Benchmark: <b className="text-emerald-400">{run.benchmark_id}</b></span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${
            run.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {run.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2 flex justify-between items-center text-slate-400 uppercase tracking-widest text-xs">
              Generated Assets
            </h2>
            {/* AssetGallery needs to be updated or we pass asset_paths */}
            <AssetGallery assetPaths={run.asset_paths} runId={run.run_id} />
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2 text-slate-400 uppercase tracking-widest text-xs">Generation Metadata</h2>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="grid grid-cols-2 gap-8 text-sm mb-6">
                <div>
                  <label className="text-slate-500 block text-[10px] font-bold uppercase tracking-widest mb-1">Prompt Version</label>
                  <code className="text-blue-300 font-mono bg-blue-900/20 px-2 py-1 rounded">{run.prompt_version}</code>
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px] font-bold uppercase tracking-widest mb-1">Variant</label>
                  <code className="bg-slate-800 px-2 py-1 rounded font-mono">{run.variant}</code>
                </div>
              </div>
              <label className="text-slate-500 block text-[10px] font-bold uppercase tracking-widest mb-1">Generation Notes</label>
              <div className="text-slate-300 text-sm italic leading-relaxed bg-slate-950/30 p-4 rounded-lg border border-white/5">
                {run.generation_notes || 'No notes provided.'}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl ring-1 ring-white/5 sticky top-8">
            <h2 className="text-xl font-black mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              HUMAN REVIEW
              {review && (
                <span className="text-4xl font-black text-emerald-400 tracking-tighter">{review.weighted_total_score?.toFixed(1)}</span>
              )}
            </h2>
            
            <ReviewSection runId={run.run_id} review={review} reviewMode={reviewMode} />
          </section>
        </div>
      </div>
    </div>
  );
}
