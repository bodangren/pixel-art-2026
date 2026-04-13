'use client';

import React from 'react';
import SpriteSheetPreview from './SpriteSheetPreview';
import BackgroundPreview from './BackgroundPreview';

interface AssetGalleryProps {
  assetPaths: Record<string, string>;
  runId: string;
}

const AssetGallery: React.FC<AssetGalleryProps> = ({ assetPaths, runId }) => {
  const assets = Object.entries(assetPaths);

  if (assets.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 italic">
        No assets found for this run.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assets.map(([key, path]) => {
        const isBackground = key.toLowerCase().includes('background');
        const isSheet = key.toLowerCase().includes('sheet');
        const fullPath = `/data/runs/${runId}/${path}`;
        
        // Detect geometry
        let rows = 1;
        let cols = 3;
        const frameSize = 64;

        if (key.includes('3x3')) {
          rows = 3;
          cols = 3;
        }

        return (
          <div key={key} className={isBackground ? "md:col-span-2" : ""}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">{key}</span>
            </div>
            {isBackground ? (
              <BackgroundPreview src={fullPath} />
            ) : isSheet ? (
              <SpriteSheetPreview src={fullPath} rows={rows} cols={cols} frameSize={frameSize} />
            ) : (
              <div className="p-4 border border-slate-800 rounded-lg bg-slate-950 flex flex-col items-center justify-center gap-2 min-h-[200px]">
                <img src={fullPath} alt={key} className="max-h-48 object-contain" style={{ imageRendering: 'pixelated' }} />
                <span className="text-[10px] text-slate-600 uppercase tracking-widest italic">Static Asset</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssetGallery;
