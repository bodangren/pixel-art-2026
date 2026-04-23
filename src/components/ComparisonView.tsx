'use client';

import React, { useState, useEffect } from 'react';
import type { Run, Review } from '@/../lib/schemas';

interface ComparisonViewProps {
  runs: Run[];
  initialLeftRunId: string;
  initialRightRunId: string;
  assetKey: 'background' | 'hero' | 'enemy' | 'effect';
  initialReviews?: { runId: string; review: Review | null }[];
}

interface ZoomPanelProps {
  run: Run;
  assetKey: string;
  zoom: number;
  transparent: boolean;
  onZoomChange: (zoom: number) => void;
  onRunChange: (runId: string) => void;
  runs: Run[];
}

const ZoomPanel: React.FC<ZoomPanelProps> = ({
  run,
  assetKey,
  zoom,
  transparent,
  onZoomChange,
  onRunChange,
  runs
}) => {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  
  const isBackground = assetKey === 'background';
  const isSheet = assetKey === 'hero' || assetKey === 'enemy' || assetKey === 'effect';
  
  const rows = assetKey.includes('3x3') ? 3 : 1;
  const cols = assetKey.includes('3x3') ? 3 : 3;
  const frameSize = 64;
  const totalFrames = rows * cols;
  
  useEffect(() => {
    if (!isPlaying || isBackground) return;
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % totalFrames);
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying, isBackground, totalFrames]);
  
  const assetPath = run.asset_paths[assetKey as keyof typeof run.asset_paths];
  const fullPath = `/data/runs/${run.run_id}/${assetPath}`;
  
  const row = Math.floor(frame / cols);
  const col = frame % cols;
  
  const idPrefix = React.useId();
  
  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-slate-900 text-white">
      <div className="flex items-center justify-between">
        <select
          id={`${idPrefix}-run`}
          aria-label="Select run"
          value={run.run_id}
          onChange={(e) => onRunChange(e.target.value)}
          className="bg-slate-800 text-white px-3 py-1.5 rounded border border-slate-700 text-sm"
        >
          {runs.map((r) => (
            <option key={r.run_id} value={r.run_id}>
              {r.model_id} ({r.run_date})
            </option>
          ))}
        </select>
        <span className="text-sm font-mono text-slate-400">{run.model_id}</span>
      </div>
      
      <div className="flex justify-center items-center bg-slate-950 p-4 border border-slate-800 rounded relative overflow-auto min-h-[200px]"
        style={{ backgroundColor: transparent ? 'transparent' : undefined }}
      >
        <div className="relative bg-black">
          {isBackground ? (
            <img 
              src={fullPath}
              alt={assetKey}
              style={{
                width: 256 * zoom,
                height: 256 * zoom,
                imageRendering: 'pixelated',
                opacity: transparent ? 0.5 : 1,
              }}
            />
          ) : isSheet ? (
            <div 
              className="relative overflow-hidden border border-slate-700"
              style={{
                width: frameSize * zoom,
                height: frameSize * zoom,
              }}
            >
              <div
                style={{
                  width: frameSize * cols * zoom,
                  height: frameSize * rows * zoom,
                  backgroundImage: `url(${fullPath})`,
                  backgroundSize: `${frameSize * cols * zoom}px ${frameSize * rows * zoom}px`,
                  backgroundPosition: `-${col * frameSize * zoom}px -${row * frameSize * zoom}px`,
                  imageRendering: 'pixelated',
                  opacity: transparent ? 0.5 : 1,
                }}
              />
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none border-2 border-red-500"
                />
              )}
            </div>
          ) : (
            <img 
              src={fullPath}
              alt={assetKey}
              style={{
                width: 128 * zoom,
                height: 128 * zoom,
                imageRendering: 'pixelated',
                opacity: transparent ? 0.5 : 1,
              }}
            />
          )}
        </div>
      </div>
      
      {!isBackground && isSheet && (
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1 rounded text-sm ${showGrid ? 'bg-green-600' : 'bg-slate-700'}`}
          >
            Grid
          </button>
        </div>
      )}
      
      <div className="bg-slate-800/50 p-3 rounded space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={`${idPrefix}-zoom`} className="text-sm text-slate-400 whitespace-nowrap">
            Zoom: {zoom}x
          </label>
          <select
            id={`${idPrefix}-zoom`}
            aria-label="Zoom"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="bg-slate-700 text-white px-2 py-1 rounded text-sm flex-1"
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
            <option value={8}>8x</option>
          </select>
        </div>
        
        <div className="text-xs text-slate-500 uppercase tracking-wider">
          Asset: {assetKey}
        </div>
      </div>
    </div>
  );
};

const ComparisonView: React.FC<ComparisonViewProps> = ({
  runs,
  initialLeftRunId,
  initialRightRunId,
  assetKey,
  initialReviews
}) => {
  const [leftRunId, setLeftRunId] = useState(initialLeftRunId);
  const [rightRunId, setRightRunId] = useState(initialRightRunId);
  const [selectedAsset, setSelectedAsset] = useState(assetKey);
  const [zoom, setZoom] = useState(4);
  const [transparent, setTransparent] = useState(false);
  const [leftReview, setLeftReview] = useState<Review | null>(() => {
    if (initialReviews) {
      const found = initialReviews.find(r => r.runId === leftRunId);
      return found?.review ?? null;
    }
    return null;
  });
  const [rightReview, setRightReview] = useState<Review | null>(() => {
    if (initialReviews) {
      const found = initialReviews.find(r => r.runId === rightRunId);
      return found?.review ?? null;
    }
    return null;
  });
  
  const leftRun = runs.find((r) => r.run_id === leftRunId);
  const rightRun = runs.find((r) => r.run_id === rightRunId);
  
  useEffect(() => {
    if (initialReviews) return;
    const fetchReviews = async () => {
      if (leftRunId) {
        const res = await fetch(`/api/reviews?runId=${leftRunId}`);
        if (res.ok) setLeftReview(await res.json());
      }
      if (rightRunId) {
        const res = await fetch(`/api/reviews?runId=${rightRunId}`);
        if (res.ok) setRightReview(await res.json());
      }
    };
    fetchReviews();
  }, [leftRunId, rightRunId, initialReviews]);
  
  if (!leftRun || !rightRun) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
        Loading runs...
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
        <label className="text-sm text-slate-400">Compare Models:</label>
        
        <select
          aria-label="Asset"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value as typeof assetKey)}
          className="bg-slate-800 text-white px-3 py-1.5 rounded border border-slate-700 text-sm"
        >
          <option value="background">Background</option>
          <option value="hero">Hero (3x3)</option>
          <option value="enemy">Enemy (3x3)</option>
          <option value="effect">Effect (3x3)</option>
        </select>
        
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="checkbox"
            id="transparent-toggle"
            checked={transparent}
            onChange={(e) => setTransparent(e.target.checked)}
            className="accent-blue-500"
          />
          <label htmlFor="transparent-toggle" className="text-sm text-slate-300">
            Transparent
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZoomPanel
          run={leftRun}
          assetKey={selectedAsset}
          zoom={zoom}
          transparent={transparent}
          onZoomChange={setZoom}
          onRunChange={setLeftRunId}
          runs={runs}
        />
        <ZoomPanel
          run={rightRun}
          assetKey={selectedAsset}
          zoom={zoom}
          transparent={transparent}
          onZoomChange={setZoom}
          onRunChange={setRightRunId}
          runs={runs}
        />
      </div>
      
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Score Comparison</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">{leftRun.model_id}</div>
            <div className="text-2xl font-bold text-blue-400">
              {leftReview?.weighted_total_score?.toFixed(1) ?? 'N/A'}
            </div>
            {leftReview && (
              <div className="text-xs text-slate-400 mt-1">
                B: {leftReview.rubric_scores.background} | H: {leftReview.rubric_scores.hero} | E: {leftReview.rubric_scores.enemy}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">{rightRun.model_id}</div>
            <div className="text-2xl font-bold text-purple-400">
              {rightReview?.weighted_total_score?.toFixed(1) ?? 'N/A'}
            </div>
            {rightReview && (
              <div className="text-xs text-slate-400 mt-1">
                B: {rightReview.rubric_scores.background} | H: {rightReview.rubric_scores.hero} | E: {rightReview.rubric_scores.enemy}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;