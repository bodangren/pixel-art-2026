import React from 'react'
import Link from 'next/link'
import { listRuns } from '@/../lib/data'
import GameCanvas from '@/components/GameCanvas'

export default async function PreviewPage() {
  const runs = await listRuns()
  const sortedRuns = [...runs].sort((a, b) =>
    new Date(b.run_date).getTime() - new Date(a.run_date).getTime()
  )

  const latestRun = sortedRuns[0]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white">P</div>
            <span className="font-black tracking-tighter text-xl">PIXEL-BENCH</span>
          </div>
          <nav className="flex gap-6 text-xs">
            <Link href="/" className="text-slate-500 hover:text-white transition-colors">Gallery</Link>
            <Link href="/preview" className="text-blue-400 font-bold uppercase tracking-widest">Preview</Link>
            <Link href="/compare" className="text-slate-500 hover:text-white transition-colors">Compare</Link>
            <Link href="/leaderboard" className="text-slate-500 hover:text-white transition-colors">Leaderboard</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black mb-2">Game Preview</h1>
          <p className="text-slate-400 text-sm">
            Preview how generated pixel art assets look when animated and tiled in-game.
            Click on the canvas to move the hero sprite.
          </p>
        </div>

        {sortedRuns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-slate-500 font-mono text-sm">No benchmark runs available</div>
            <Link href="/" className="text-blue-400 text-xs font-mono uppercase tracking-widest hover:text-blue-300">
              ← Back to Gallery
            </Link>
          </div>
        ) : (
          <GameCanvas runs={sortedRuns} initialRunId={latestRun?.run_id || ''} />
        )}
      </main>
    </div>
  )
}