'use client';

import React from 'react';
import SpriteSheetPreview from './SpriteSheetPreview';
import BackgroundPreview from './BackgroundPreview';

interface AssetCardProps {
  assetKey: string;
  path: string;
  fullPath: string;
  isBackground: boolean;
  isSheet: boolean;
  rows?: number;
  cols?: number;
  frameSize?: number;
}

const AssetCard: React.FC<AssetCardProps> = ({ assetKey, fullPath, isBackground, isSheet, rows = 1, cols = 3, frameSize = 64 }) => {
  return (
    <div data-testid="asset-card" className={isBackground ? "md:col-span-2" : ""}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">{assetKey}</span>
      </div>
      {isBackground ? (
        <BackgroundPreview src={fullPath} />
      ) : isSheet ? (
        <SpriteSheetPreview src={fullPath} rows={rows} cols={cols} frameSize={frameSize} />
      ) : (
        <div className="p-4 border border-slate-800 rounded-lg bg-slate-950 flex flex-col items-center justify-center gap-2 min-h-[200px]">
          <img src={fullPath} alt={assetKey} className="max-h-48 object-contain" style={{ imageRendering: 'pixelated' }} />
          <span className="text-[10px] text-slate-600 uppercase tracking-widest italic">Static Asset</span>
        </div>
      )}
    </div>
  );
};

export default AssetCard;