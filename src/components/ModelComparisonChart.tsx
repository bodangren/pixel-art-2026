'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ModelComparisonChartProps {
  data: Array<{ model: string; averageScore: number; runCount: number }>
  title: string
}

export function ModelComparisonChart({ data, title }: ModelComparisonChartProps) {
  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444']

  return (
    <div className="bg-slate-900 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <XAxis dataKey="model" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Bar dataKey="averageScore" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}