'use client';

import React from 'react';
import { StyleCategory, stylePresets } from '@/../lib/style-metadata';

interface StyleReferenceGalleryProps {
  style: StyleCategory;
  onClose?: () => void;
}

const styleColors: Record<StyleCategory, string> = {
  rpg: 'bg-emerald-900 border-emerald-700',
  isometric: 'bg-amber-900 border-amber-700',
  scifi: 'bg-violet-900 border-violet-700',
  ui: 'bg-cyan-900 border-cyan-700',
  font: 'bg-pink-900 border-pink-700'
};

export default function StyleReferenceGallery({ style, onClose }: StyleReferenceGalleryProps) {
  const preset = stylePresets[style];

  return (
    <div className={`p-4 rounded-lg border ${styleColors[style]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{preset.name}</h3>
          <p className="text-sm text-slate-300">{preset.description}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
            aria-label="Close gallery"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-slate-400 block text-xs uppercase">Dimensions</span>
          <span className="text-white font-mono">
            {preset.sprite_dimensions.map(d => `${d[0]}x${d[1]}`).join(', ')}
          </span>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-slate-400 block text-xs uppercase">Color Limit</span>
          <span className="text-white font-mono">{preset.color_limit} colors</span>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-slate-400 block text-xs uppercase">Animation</span>
          <span className="text-white font-mono">{preset.animation_frames[0]}-{preset.animation_frames[1]} frames</span>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <span className="text-slate-400 block text-xs uppercase">Grid</span>
          <span className="text-white font-mono">{preset.grid_alignment}</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Hover over reference images to zoom
      </div>
    </div>
  );
}