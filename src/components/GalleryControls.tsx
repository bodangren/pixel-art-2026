'use client';

import React from 'react';

export interface GalleryFilters {
  assetType: 'all' | 'background' | 'sheet' | 'static';
  modelId: string;
  sortBy: 'date' | 'model' | 'score';
  sortOrder: 'asc' | 'desc';
}

interface GalleryControlsProps {
  filters: GalleryFilters;
  onFilterChange: (filters: GalleryFilters) => void;
  models?: string[];
}

export const FilterControls: React.FC<GalleryControlsProps> = ({ filters, onFilterChange, models = [] }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
      <div className="flex flex-col gap-1">
        <label htmlFor="asset-type-filter" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Asset Type
        </label>
        <select
          id="asset-type-filter"
          value={filters.assetType}
          onChange={(e) => onFilterChange({ ...filters, assetType: e.target.value as GalleryFilters['assetType'] })}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="background">Backgrounds</option>
          <option value="sheet">Sprite Sheets</option>
          <option value="static">Static Assets</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="model-filter" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Model
        </label>
        <select
          id="model-filter"
          value={filters.modelId}
          onChange={(e) => onFilterChange({ ...filters, modelId: e.target.value })}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Models</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort-by" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Sort By
        </label>
        <select
          id="sort-by"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as GalleryFilters['sortBy'] })}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="date">Date</option>
          <option value="model">Model</option>
          <option value="score">Score</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Order
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange({ ...filters, sortOrder: 'desc' })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.sortOrder === 'desc'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ↓ Desc
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, sortOrder: 'asc' })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.sortOrder === 'asc'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ↑ Asc
          </button>
        </div>
      </div>
    </div>
  );
};