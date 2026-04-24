'use client'

interface BoxPlotProps {
  title: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

export function BoxPlot({ title, min, q1, median, q3, max }: BoxPlotProps) {
  const range = max - min
  const q1Pos = ((q1 - min) / range) * 100
  const medianPos = ((median - min) / range) * 100
  const q3Pos = ((q3 - min) / range) * 100

  return (
    <div className="bg-slate-900 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title}</h3>
      <div className="relative h-8 bg-slate-800 rounded">
        <div
          className="absolute top-0 h-full bg-blue-600/30 border-l-2 border-r-2 border-blue-400"
          style={{ left: `${q1Pos}%`, width: `${q3Pos - q1Pos}%` }}
        />
        <div
          className="absolute top-1/2 w-0.5 h-6 bg-blue-400 -translate-y-1/2"
          style={{ left: `${medianPos}%` }}
        />
        <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-slate-400" />
        <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-slate-400" />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>{min}</span>
        <span>Q1: {q1}</span>
        <span>Med: {median}</span>
        <span>Q3: {q3}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}