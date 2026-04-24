'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface TrendPoint {
  date: string
  score: number
  movingAvg?: number
}

interface TrendLineProps {
  data: TrendPoint[]
  title: string
  direction?: 'up' | 'down' | 'stable'
}

export function TrendLine({ data, title, direction = 'stable' }: TrendLineProps) {
  const directionColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-slate-400'
  }

  const directionSymbols = {
    up: '↑',
    down: '↓',
    stable: '→'
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
        <span className={`text-sm font-bold ${directionColors[direction]}`}>
          {directionSymbols[direction]} {direction}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Score" />
          <Line type="monotone" dataKey="movingAvg" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Moving Avg" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}