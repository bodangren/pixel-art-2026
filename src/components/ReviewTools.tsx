'use client';

import React from 'react';

interface ReviewToolsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onGridToggle: () => void;
  showCheckerboard: boolean;
  onCheckerboardToggle: () => void;
  className?: string;
}

const ReviewTools: React.FC<ReviewToolsProps> = ({
  zoom,
  onZoomChange,
  showGrid,
  onGridToggle,
  showCheckerboard,
  onCheckerboardToggle,
  className = '',
}) => {
  const idPrefix = React.useId();

  return (
    <div className={`flex flex-wrap items-center gap-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg ${className}`}>
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label htmlFor={`${idPrefix}-zoom`} className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Zoom: {Math.round(zoom * 100)}%
        </label>
        <input 
          id={`${idPrefix}-zoom`}
          type="range" 
          min="0.5" 
          max="10" 
          step="0.5" 
          value={zoom} 
          onChange={(e) => onZoomChange(parseFloat(e.target.value))} 
          className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onGridToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all ${
            showGrid 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className={`w-3 h-3 border ${showGrid ? 'border-white' : 'border-slate-400'} grid grid-cols-2 grid-rows-2`}>
             <div className="border-[0.5px] border-inherit" />
             <div className="border-[0.5px] border-inherit" />
             <div className="border-[0.5px] border-inherit" />
             <div className="border-[0.5px] border-inherit" />
          </div>
          Grid
        </button>

        <button 
          onClick={onCheckerboardToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all ${
            showCheckerboard 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className={`w-3 h-3 border ${showCheckerboard ? 'border-white' : 'border-slate-400'} bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-[length:4px_4px]`} />
          Checkerboard
        </button>
      </div>
    </div>
  );
};

export default ReviewTools;
