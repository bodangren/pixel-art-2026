'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ZoomContainerProps {
  src: string;
  width: number;
  height: number;
  is3x3Grid?: boolean;
  showGrid?: boolean;
  onShowGridChange?: (show: boolean) => void;
}

const ZOOM_LEVELS = [1, 2, 4, 8, 'max'] as const;
type ZoomLevel = typeof ZOOM_LEVELS[number];

const ZoomContainer: React.FC<ZoomContainerProps> = ({
  src,
  width,
  height,
  is3x3Grid = false,
  showGrid = false,
  onShowGridChange,
}) => {
  const [zoom, setZoom] = useState<ZoomLevel>(1);
  const [internalShowGrid, setInternalShowGrid] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const effectiveShowGrid = onShowGridChange !== undefined ? showGrid : internalShowGrid;
  const setEffectiveShowGrid = onShowGridChange !== undefined ? onShowGridChange : setInternalShowGrid;

  const getZoomMultiplier = useCallback((z: ZoomLevel): number => {
    if (z === 'max') {
      const maxDim = Math.max(width, height);
      const containerSize = 300;
      return Math.max(1, Math.floor(containerSize / maxDim));
    }
    return z as number;
  }, [width, height]);

  const zoomMultiplier = getZoomMultiplier(zoom);
  const scaledWidth = width * zoomMultiplier;
  const scaledHeight = height * zoomMultiplier;

  const handleZoomChange = (newZoom: ZoomLevel) => {
    setZoom(newZoom);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomMultiplier <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomMultiplier > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPan({ x: newX, y: newY });
    }

    if (effectiveShowGrid && is3x3Grid && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const cellWidth = rect.width / 3;
      const cellHeight = rect.height / 3;
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const col = Math.floor(relX / cellWidth);
      const row = Math.floor(relY / cellHeight);
      if (col >= 0 && col < 3 && row >= 0 && row < 3) {
        setHoveredCell({ row, col });
      } else {
        setHoveredCell(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredCell(null);
  };

  const idPrefix = React.useId();

  const renderCellBorders = () => {
    if (!effectiveShowGrid || !is3x3Grid) return null;
    const cells = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`absolute border border-red-500/30 ${isHovered ? 'border-red-500 border-2' : ''}`}
            style={{
              left: `${(col * 100) / 3}%`,
              top: `${(row * 100) / 3}%`,
              width: '33.333%',
              height: '33.333%',
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 border rounded bg-slate-900 text-white"
      data-testid="zoom-container"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-tight">Zoom Viewer</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setEffectiveShowGrid(!effectiveShowGrid)}
            className={`px-4 py-1.5 rounded font-medium transition-colors ${effectiveShowGrid ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Grid
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        aria-label="zoom container"
        className="flex justify-center items-center bg-slate-950 p-4 border border-slate-800 rounded relative overflow-hidden min-h-[200px]"
        style={{
          cursor: zoomMultiplier > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <div
          className="relative bg-black"
          style={{
            width: scaledWidth,
            height: scaledHeight,
            overflow: 'hidden',
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <img
            ref={imgRef}
            src={src}
            alt="Zoomable content"
            role="img"
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated',
              objectFit: 'contain',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
          {effectiveShowGrid && is3x3Grid && (
            <div
              className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3"
            >
              {renderCellBorders()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-800/50 p-3 rounded">
        <label id={`${idPrefix}-zoom-label`} className="text-sm text-slate-400 whitespace-nowrap">
          Zoom: {zoom}x
        </label>
        <div className="flex gap-1" role="group" aria-labelledby={`${idPrefix}-zoom-label`}>
          {ZOOM_LEVELS.map((level) => (
            <button
              key={level}
              role="button"
              aria-label={level === 'max' ? 'max' : `${level}x`}
              onClick={() => handleZoomChange(level)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                zoom === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {level === 'max' ? 'max' : `${level}x`}
            </button>
          ))}
        </div>
      </div>

      {effectiveShowGrid && is3x3Grid && hoveredCell && (
        <div className="text-xs text-slate-400 text-center">
          Cell: ({hoveredCell.row}, {hoveredCell.col})
        </div>
      )}
    </div>
  );
};

export default ZoomContainer;