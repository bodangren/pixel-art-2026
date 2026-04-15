'use client';

import React from 'react';
import AssetCard from './AssetCard';

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
      {assets.map(([assetKey, path]) => {
        const isBackground = assetKey.toLowerCase().includes('background');
        const isSheet = assetKey.toLowerCase().includes('sheet');
        const fullPath = `/data/runs/${runId}/${path}`;
        
        let rows = 1;
        let cols = 3;
        const frameSize = 64;

        if (assetKey.includes('3x3')) {
          rows = 3;
          cols = 3;
        }

        return (
          <AssetCard
            key={assetKey}
            assetKey={assetKey}
            path={path}
            fullPath={fullPath}
            isBackground={isBackground}
            isSheet={isSheet}
            rows={rows}
            cols={cols}
            frameSize={frameSize}
          />
        );
      })}
    </div>
  );
};

export default AssetGallery;
