import fs from 'fs/promises'
import path from 'path'
import { buildDerivedData } from './build-derived-logic'

async function main() {
  console.log('🚀 Building derived data...')
  
  const leaderboard = await buildDerivedData()
  
  const DERIVED_DIR = path.join(process.cwd(), 'public/data/derived')
  await fs.mkdir(DERIVED_DIR, { recursive: true })
  
  await fs.writeFile(
    path.join(DERIVED_DIR, 'leaderboard.json'),
    JSON.stringify(leaderboard, null, 2),
    'utf-8'
  )
  
  console.log(`✅ Leaderboard built with ${leaderboard.length} models.`)
}

main().catch(err => {
  console.error('❌ Failed to build derived data:', err)
  process.exit(1)
})
