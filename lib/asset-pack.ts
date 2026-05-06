import fs from 'fs/promises'
import path from 'path'
import archiver from 'archiver'
import type { Run, Review } from './schemas'

const DATA_DIR = path.join(process.cwd(), 'public/data/runs')

export interface AssetPackMetadata {
  modelId: string
  runId: string
  runDate: string
  benchmarkGameId: string
  variant: string
  humanScore?: number
  techScore?: number
  assetCount: number
  generatedAt: string
}

export async function getAssetPackMetadata(runId: string): Promise<AssetPackMetadata | null> {
  try {
    const runPath = path.join(DATA_DIR, runId, 'run.json')
    const run: Run = JSON.parse(await fs.readFile(runPath, 'utf-8'))

    const reviewPath = path.join(DATA_DIR, runId, 'review.json')
    let review: Review | null = null
    try {
      review = JSON.parse(await fs.readFile(reviewPath, 'utf-8'))
    } catch {
      // No review available
    }

    const assetsDir = path.join(DATA_DIR, runId, 'assets')
    const files = await fs.readdir(assetsDir)
    const pngFiles = files.filter(f => f.endsWith('.png'))

    return {
      modelId: run.model_id,
      runId: run.run_id,
      runDate: run.run_date,
      benchmarkGameId: run.benchmark_game_id || 'unknown',
      variant: run.variant,
      humanScore: review?.weighted_total_score,
      techScore: run.technical_grade?.total_technical_score,
      assetCount: pngFiles.length,
      generatedAt: new Date().toISOString()
    }
  } catch {
    return null
  }
}

export async function generateAssetPackZip(runId: string): Promise<Buffer> {
  const metadata = await getAssetPackMetadata(runId)
  if (!metadata) {
    throw new Error(`Run not found: ${runId}`)
  }

  const assetsDir = path.join(DATA_DIR, runId, 'assets')
  const files = await fs.readdir(assetsDir)
  const pngFiles = files.filter(f => f.endsWith('.png'))

  const manifest = `# Asset Pack: ${metadata.modelId} - ${metadata.runDate}
Model: ${metadata.modelId}
Run Date: ${metadata.runDate}
Variant: ${metadata.variant}
Benchmark: ${metadata.benchmarkGameId}
Human Score: ${metadata.humanScore?.toFixed(1) ?? 'N/A'}
Technical Score: ${metadata.techScore?.toFixed(1) ?? 'N/A'}
Asset Count: ${metadata.assetCount}
Generated: ${metadata.generatedAt}

## Contents
${pngFiles.map(f => `- ${f}`).join('\n')}

## License
CC-BY 4.0 - Free to use with attribution to the benchmark project.
`

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.on('data', (chunk: Buffer) => chunks.push(chunk))
    archive.on('end', () => resolve(Buffer.concat(chunks)))
    archive.on('error', reject)

    archive.append(manifest, { name: 'README.txt' })

    for (const file of pngFiles) {
      const filePath = path.join(assetsDir, file)
      archive.file(filePath, { name: `assets/${file}` })
    }

    archive.finalize()
  })
}

export async function getAssetPackSize(runId: string): Promise<{ count: number; estimatedMB: number }> {
  try {
    const assetsDir = path.join(DATA_DIR, runId, 'assets')
    const files = await fs.readdir(assetsDir)
    const pngFiles = files.filter(f => f.endsWith('.png'))
    let totalSize = 0
    for (const file of pngFiles) {
      const stat = await fs.stat(path.join(assetsDir, file))
      totalSize += stat.size
    }
    const manifestSize = 500
    const overhead = 1024
    const totalWithOverhead = totalSize + manifestSize + overhead
    return { count: pngFiles.length, estimatedMB: totalWithOverhead / (1024 * 1024) }
  } catch {
    return { count: 0, estimatedMB: 0 }
  }
}