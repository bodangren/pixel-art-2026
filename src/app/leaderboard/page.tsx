import React from 'react'
import { getLeaderboard, listRuns } from '@/../lib/data'
import LeaderboardClient from './LeaderboardClient'

export const metadata = {
  title: 'Leaderboard | Pixel Art Benchmark',
  description: 'Compare model performance across all benchmark runs'
}

export default async function LeaderboardPage() {
  const [entries, allRuns] = await Promise.all([
    getLeaderboard(),
    listRuns()
  ])

  return <LeaderboardClient initialEntries={entries} allRuns={allRuns} />
}