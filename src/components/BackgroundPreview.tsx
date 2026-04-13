'use client';

import React, { useState } from 'react';

interface BackgroundPreviewProps {
  src: string;
}

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({ src }) => {
  const [zoom, setZoom] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const idPrefix = React.useId();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-slate-900 text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-tight">Background Preview</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-4 py-1.5 rounded font-medium transition-colors ${showOverlay ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {showOverlay ? 'Hide UI Overlay' : 'Show UI Overlay'}
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center bg-slate-950 p-4 border border-slate-800 rounded relative overflow-auto min-h-[400px]">
        <div 
          className="relative border border-slate-700 shadow-2xl bg-black"
          style={{
            width: 390 * zoom,
            height: 700 * zoom,
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'pixelated',
            }}
          >
            {/* We use an img tag inside if we want to ensure it's loaded and accessible, 
                but for a "viewport" preview of a fixed aspect ratio background, 
                background-size: cover is often more representative of mobile scaling.
                However, for a benchmark, we should show the raw asset. 
                Let's use a centered image instead. */}
            <img 
              src={src} 
              alt="Background" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            
            {showOverlay && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-24 h-6 bg-red-900/60 border border-red-500 rounded flex items-center justify-center text-[10px] font-bold shadow-lg">HP: 100/100</div>
                  <div className="w-12 h-6 bg-yellow-900/60 border border-yellow-500 rounded flex items-center justify-center text-[10px] font-bold shadow-lg">LVL 1</div>
                </div>
                
                <div className="flex justify-center mb-12">
                   <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full animate-pulse" />
                </div>

                <div className="flex justify-between items-end">
                  <div className="w-12 h-12 bg-blue-900/60 border border-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">ATK</div>
                  <div className="w-12 h-12 bg-purple-900/60 border border-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">DEF</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-3 rounded flex flex-col gap-1 text-sm">
        <label htmlFor={`${idPrefix}-zoom`} className="text-slate-400">Zoom: {Math.round(zoom * 100)}%</label>
        <input 
          id={`${idPrefix}-zoom`}
          type="range" 
          min="0.1" 
          max="2" 
          step="0.1" 
          value={zoom} 
          onChange={(e) => setZoom(parseFloat(e.target.value))} 
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
};

export default BackgroundPreview;
