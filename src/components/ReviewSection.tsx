'use client';

import React from 'react';
import RubricForm from './RubricForm';
import { Review } from '@/../lib/schemas';

interface ReviewData {
  review_timestamp: string;
  rubric_scores: { background: number; hero: number; enemy: number; effect: number; pack: number };
  notes: string;
  weighted_total_score: number;
  would_use_in_prototype_now: boolean;
}

interface ReviewSectionProps {
  runId: string;
  review: Review | null;
  reviewMode: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ runId, review, reviewMode }) => {
  const handleSave = async (data: ReviewData) => {
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runId, reviewData: data }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const err = await res.json();
      alert(`Error saving review: ${err.error}`);
    }
  };

  if (reviewMode) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-900/20 border border-amber-500/50 p-3 rounded text-amber-200 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">
          Review Mode Active
        </div>
        <RubricForm onSave={handleSave} />
      </div>
    );
  }

  if (review) {
    const categories = [
      { key: 'background', label: 'Background', score: review.rubric_scores.background },
      { key: 'hero', label: 'Hero', score: review.rubric_scores.hero },
      { key: 'enemy', label: 'Enemy', score: review.rubric_scores.enemy },
      { key: 'effect', label: 'Orb/Effect', score: review.rubric_scores.effect },
      { key: 'pack', label: 'Coherence', score: review.rubric_scores.pack },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest mb-4 border-b border-slate-800 pb-2">Score Breakdown</h3>
          <div className="grid grid-cols-1 gap-3">
            {categories.map((cat) => (
              <div key={cat.key} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-lg border border-white/5">
                <span className="text-xs font-medium text-slate-300">{cat.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(cat.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-sm text-blue-400 w-6 text-right">{cat.score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-800/20 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${review.would_use_in_prototype_now ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
            <h3 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest">Prototype Ready?</h3>
            <span className={`ml-auto font-black text-xs ${review.would_use_in_prototype_now ? 'text-emerald-400' : 'text-red-400'}`}>
              {review.would_use_in_prototype_now ? 'YES' : 'NO'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest mb-3 border-b border-slate-800 pb-2">Reviewer Notes</h3>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 relative">
            <span className="absolute -top-3 left-4 text-2xl text-slate-800 font-serif">&ldquo;</span>
            <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">{review.notes || 'No review notes provided.'}</p>
            <span className="absolute -bottom-6 right-4 text-2xl text-slate-800 font-serif">&rdquo;</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800 text-[10px] text-slate-600 font-mono flex justify-between">
          <span>RUN_ID: {runId}</span>
          <span>{new Date(review.review_timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
      <p className="text-slate-500 italic text-sm mb-4">No human review submitted yet.</p>
      <div className="inline-block px-3 py-1 bg-slate-900 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        Enable Review Mode to Score
      </div>
    </div>
  );
};

export default ReviewSection;