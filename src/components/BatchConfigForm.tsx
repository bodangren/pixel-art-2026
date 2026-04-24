'use client';

import React, { useState } from 'react';

const AVAILABLE_GAMES = [
  { slug: 'labyrinth-goblin-king', name: 'Labyrinth of the Goblin King' },
  { slug: 'dungeon-crawler', name: 'Dungeon Crawler' },
  { slug: 'space-invaders-clone', name: 'Space Invaders Clone' },
];

const AVAILABLE_MODELS = [
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro' },
  { id: 'gpt-5.3-codex-medium', name: 'GPT-5.3 Codex Medium' },
  { id: 'sonnet-4.6', name: 'Sonnet 4.6' },
  { id: 'opus-4.6', name: 'Opus 4.6' },
];

interface BatchConfigFormProps {
  onSubmit: (config: {
    games: string[];
    models: string[];
    maxConcurrency: number;
    retryLimit: number;
  }) => void;
}

const BatchConfigForm: React.FC<BatchConfigFormProps> = ({ onSubmit }) => {
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [retryLimit, setRetryLimit] = useState(3);

  const toggleGame = (slug: string) => {
    setSelectedGames(prev =>
      prev.includes(slug) ? prev.filter(g => g !== slug) : [...prev, slug]
    );
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId) ? prev.filter(m => m !== modelId) : [...prev, modelId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      games: selectedGames,
      models: selectedModels,
      maxConcurrency,
      retryLimit,
    });
  };

  const isValid = selectedGames.length > 0 && selectedModels.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Games</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_GAMES.map(game => (
            <label
              key={game.slug}
              htmlFor={`game-${game.slug}`}
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                selectedGames.includes(game.slug)
                  ? 'border-blue-500 bg-blue-950/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <input
                id={`game-${game.slug}`}
                type="checkbox"
                aria-label={game.name}
                checked={selectedGames.includes(game.slug)}
                onChange={() => toggleGame(game.slug)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-200">{game.name}</span>
              <span className="ml-auto text-xs font-mono text-slate-500">{game.slug}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_MODELS.map(model => (
            <label
              key={model.id}
              htmlFor={`model-${model.id}`}
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                selectedModels.includes(model.id)
                  ? 'border-purple-500 bg-purple-950/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <input
                id={`model-${model.id}`}
                type="checkbox"
                aria-label={model.name}
                checked={selectedModels.includes(model.id)}
                onChange={() => toggleModel(model.id)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-slate-200">{model.name}</span>
              <span className="ml-auto text-xs font-mono text-slate-500">{model.id}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="max-concurrency" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            Max Concurrency
          </label>
          <input
            id="max-concurrency"
            type="number"
            min={1}
            max={10}
            value={maxConcurrency}
            onChange={e => setMaxConcurrency(parseInt(e.target.value) || 3)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-2 text-xs text-slate-500">1-10 parallel jobs</p>
        </div>

        <div>
          <label htmlFor="retry-limit" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            Retry Limit
          </label>
          <input
            id="retry-limit"
            type="number"
            min={0}
            max={5}
            value={retryLimit}
            onChange={e => setRetryLimit(parseInt(e.target.value) || 0)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-2 text-xs text-slate-500">0-5 retries per job</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-sm text-slate-500">
          <span className="font-mono">{selectedGames.length}</span> games × <span className="font-mono">{selectedModels.length}</span> models = <span className="font-mono font-bold text-white">{selectedGames.length * selectedModels.length}</span> jobs
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            isValid
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-lg shadow-blue-900/20'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Start Batch Run
        </button>
      </div>
    </form>
  );
};

export default BatchConfigForm;