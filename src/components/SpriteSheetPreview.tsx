'use client';

import React, { useState, useEffect } from 'react';

interface SpriteSheetPreviewProps {
  src: string;
  rows: number;
  cols: number;
  frameSize: number;
}

const SpriteSheetPreview: React.FC<SpriteSheetPreviewProps> = ({ src, rows, cols, frameSize }) => {
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(8);
  const [zoom, setZoom] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const totalFrames = rows * cols;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % totalFrames);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [isPlaying, fps, totalFrames]);

  const row = Math.floor(frame / cols);
  const col = frame % cols;

  const idPrefix = React.useId();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-slate-900 text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-tight">Sprite Animation</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 bg-blue-600 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`px-4 py-1.5 rounded font-medium transition-colors ${showGrid ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Grid
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center bg-slate-950 p-4 border border-slate-800 rounded relative overflow-auto">
        <div 
          className="relative overflow-hidden border border-slate-700 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat"
          style={{
            width: frameSize * zoom,
            height: frameSize * zoom,
          }}
        >
          <div
            style={{
              width: frameSize * cols * zoom,
              height: frameSize * rows * zoom,
              backgroundImage: `url(${src})`,
              backgroundSize: `${frameSize * cols * zoom}px ${frameSize * rows * zoom}px`,
              backgroundPosition: `-${col * frameSize * zoom}px -${row * frameSize * zoom}px`,
              imageRendering: 'pixelated',
            }}
          />
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none border border-red-500/50" 
              style={{
                boxShadow: `inset 0 0 0 1px rgba(239, 68, 68, 0.5)`
              }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm bg-slate-800/50 p-3 rounded">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-fps`} className="text-slate-400">FPS: {fps}</label>
          <input 
            id={`${idPrefix}-fps`}
            type="range" 
            min="1" 
            max="60" 
            value={fps} 
            onChange={(e) => setFps(parseInt(e.target.value))} 
            className="w-full accent-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-zoom`} className="text-slate-400">Zoom: {zoom}x</label>
          <input 
            id={`${idPrefix}-zoom`}
            type="range" 
            min="1" 
            max="10" 
            value={zoom} 
            onChange={(e) => setZoom(parseInt(e.target.value))} 
            className="w-full accent-blue-500"
          />
        </div>
        <div className="flex flex-col col-span-2 gap-1">
          <label htmlFor={`${idPrefix}-frame`} className="text-slate-400 text-center">
            Frame: {frame + 1} / {totalFrames}
          </label>
          <input 
            id={`${idPrefix}-frame`}
            type="range" 
            min="0" 
            max={totalFrames - 1} 
            value={frame} 
            onChange={(e) => { setIsPlaying(false); setFrame(parseInt(e.target.value)); }} 
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SpriteSheetPreview;
