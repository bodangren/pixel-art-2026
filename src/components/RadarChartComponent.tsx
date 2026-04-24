'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface RadarDataPoint {
  metric: string
  value: number
  baseline?: number
}

interface RadarChartComponentProps {
  data: RadarDataPoint[]
  title: string
}

export function RadarChartComponent({ data, title }: RadarChartComponentProps) {
  return (
    <div className="bg-slate-900 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend />
          <Radar name="Model" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
          {data[0]?.baseline !== undefined && (
            <Radar name="Baseline" dataKey="baseline" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}