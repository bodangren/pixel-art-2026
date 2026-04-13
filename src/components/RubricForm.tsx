'use client';

import React, { useState, useMemo } from 'react';

interface RubricFormProps {
  runId: string;
  onSave: (data: any) => void;
}

const RubricForm: React.FC<RubricFormProps> = ({ runId, onSave }) => {
  const [scores, setScores] = useState({
    background: 3,
    hero: 3,
    enemy: 3,
    orb: 3,
    coherence: 3,
  });
  const [prototypeReady, setPrototypeReady] = useState(false);
  const [notes, setNotes] = useState('');

  const idPrefix = React.useId();

  const weights = {
    background: 0.20,
    hero: 0.25,
    enemy: 0.20,
    orb: 0.15,
    coherence: 0.20,
  };

  const weightedTotal = useMemo(() => {
    return (
      scores.background * weights.background +
      scores.hero * weights.hero +
      scores.enemy * weights.enemy +
      scores.orb * weights.orb +
      scores.coherence * weights.coherence
    );
  }, [scores, weights.background, weights.coherence, weights.enemy, weights.hero, weights.orb]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = {
      review_timestamp: new Date().toISOString(),
      rubric_scores: {
        background: scores.background,
        hero: scores.hero,
        enemy: scores.enemy,
        effect: scores.orb,
        pack: scores.coherence,
      },
      notes,
      weighted_total_score: Math.round(weightedTotal * 100) / 100,
      would_use_in_prototype_now: prototypeReady,
    };
    onSave(reviewData);
  };

  const updateScore = (key: keyof typeof scores, value: string) => {
    setScores(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const categories = [
    { key: 'background', label: 'Background', weight: weights.background },
    { key: 'hero', label: 'Hero', weight: weights.hero },
    { key: 'enemy', label: 'Enemy', weight: weights.enemy },
    { key: 'orb', label: 'Orb', weight: weights.orb },
    { key: 'coherence', label: 'Coherence', weight: weights.coherence },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-xl font-black uppercase tracking-tighter text-blue-400">Human Review Rubric</h3>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weighted Score</div>
          <div className="text-2xl font-black text-white">{weightedTotal.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {categories.map(({ key, label, weight }) => (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label htmlFor={`${idPrefix}-${key}`} className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                {label}: <span className="text-blue-400">{scores[key].toFixed(1)}</span>
              </label>
              <span className="text-[10px] text-slate-600 font-mono">WT: {(weight * 100)}%</span>
            </div>
            <input 
              id={`${idPrefix}-${key}`}
              type="range" 
              min="1" 
              max="5" 
              step="0.5" 
              value={scores[key]} 
              onChange={(e) => updateScore(key, e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer group">
        <input 
          type="checkbox" 
          id={`${idPrefix}-prototype`}
          checked={prototypeReady}
          onChange={(e) => setPrototypeReady(e.target.checked)}
          className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
        />
        <label htmlFor={`${idPrefix}-prototype`} className="text-sm font-bold text-slate-200 cursor-pointer flex-1">
          Mark as Prototype Ready?
          <span className="block text-[10px] font-normal text-slate-500 group-hover:text-slate-400">Assets meet all technical and aesthetic requirements.</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-notes`} className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qualitative Notes</label>
        <textarea 
          id={`${idPrefix}-notes`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Detailed breakdown of what works and what fails..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
        />
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-lg shadow-lg shadow-blue-900/40 transition-all active:scale-[0.99] uppercase tracking-tighter"
      >
        Save Final Review
      </button>
    </form>
  );
};

export default RubricForm;
