import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { validateAssets } from './validate-run-logic'

async function getMetadata(filePath: string) {
  const meta = await sharp(filePath).metadata()
  return { width: meta.width, height: meta.height }
}

async function main() {
  const runId = process.argv[2]
  if (!runId) {
    console.error('❌ Please provide a runId: npm run validate <runId>')
    process.exit(1)
  }

  const runPath = path.join(process.cwd(), 'public/data/runs', runId, 'run.json')
  
  try {
    const run = JSON.parse(await fs.readFile(runPath, 'utf-8'))
    const assetsDir = path.join(process.cwd(), 'public/data/runs', runId)
    
    // Resolve absolute paths for sharp
    const assetPaths: Record<string, string> = {}
    for (const [key, relativePath] of Object.entries(run.asset_paths)) {
      assetPaths[key] = path.join(assetsDir, relativePath as string)
    }

    console.log(`🔍 Validating assets for run: ${runId}...`)
    
    const results = await validateAssets(assetPaths, getMetadata)

    if (results.valid) {
      console.log('✅ All assets meet technical specifications.')
    } else {
      console.error('❌ Validation failed:')
      results.errors.forEach(err => console.error(`  - ${err}`))
      process.exit(1)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`❌ Error reading run data: ${message}`)
    process.exit(1)
  }
}

main()
