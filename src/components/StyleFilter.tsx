'use client';

import React from 'react';
import { StyleCategory } from '@/../lib/style-metadata';

interface StyleFilterProps {
  selectedStyle: StyleCategory | 'all';
  onStyleChange: (style: StyleCategory | 'all') => void;
}

const styles: { value: StyleCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Styles', color: 'bg-slate-700 hover:bg-slate-600' },
  { value: 'rpg', label: '16-bit RPG', color: 'bg-emerald-700 hover:bg-emerald-600' },
  { value: 'isometric', label: 'Isometric', color: 'bg-amber-700 hover:bg-amber-600' },
  { value: 'scifi', label: 'Top-down Sci-fi', color: 'bg-violet-700 hover:bg-violet-600' },
  { value: 'ui', label: 'UI Buttons', color: 'bg-cyan-700 hover:bg-cyan-600' },
  { value: 'font', label: 'Font Sheets', color: 'bg-pink-700 hover:bg-pink-600' }
];

export default function StyleFilter({ selectedStyle, onStyleChange }: StyleFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-900 rounded-lg border border-slate-800">
      <span className="text-sm text-slate-400 mr-2">Style:</span>
      {styles.map((style) => (
        <button
          key={style.value}
          onClick={() => onStyleChange(style.value)}
          aria-pressed={selectedStyle === style.value}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            selectedStyle === style.value
              ? `${style.color} text-white ring-2 ring-offset-2 ring-offset-slate-900`
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}