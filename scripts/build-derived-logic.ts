import fs from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'

const DATA_DIR = path.join(process.cwd(), 'public/data/runs')

async function runValidation(runId: string): Promise<number> {
  return new Promise((resolve) => {
    const proc = spawn('python3', ['scripts/validate_run.py', runId, '--output', '/tmp/validation_report.json'], {
      cwd: process.cwd(),
    })
    proc.stdout.on('data', () => {})
    proc.stderr.on('data', () => {})
    proc.on('close', (code) => {
      if (code === 0) {
        try {
          const report = JSON.parse(require('fs').readFileSync('/tmp/validation_report.json', 'utf-8'))
          resolve(report.overall_score || 0)
        } catch {
          resolve(0)
        }
      } else {
        resolve(0)
      }
    })
  })
}

export async function buildDerivedData() {
  const runDirs = await fs.readdir(DATA_DIR)
  const allData = await Promise.all(
    runDirs.map(async (dirName) => {
      const runPath = path.join(DATA_DIR, dirName, 'run.json')
      const reviewPath = path.join(DATA_DIR, dirName, 'review.json')
      
      try {
        const runContent = await fs.readFile(runPath, 'utf-8')
        const run = JSON.parse(runContent)
        
        let review = null
        try {
          const reviewContent = await fs.readFile(reviewPath, 'utf-8')
          review = JSON.parse(reviewContent)
        } catch (e) {
        }
        
        return { run, review, dirName }
      } catch (e) {
        return null
      }
    })
  )

  const validData = allData.filter((d): d is { run: any, review: any, dirName: string } => d !== null)
  
  const modelMap = new Map<string, any>()

  for (const { run, review, dirName } of validData) {
    const modelId = run.model_id
    if (!modelMap.has(modelId)) {
      modelMap.set(modelId, {
        model_id: modelId,
        runs: [],
        total_human_score: 0,
        total_tech_score: 0,
        review_count: 0,
        tech_score_count: 0,
        latest_run_date: run.run_date
      })
    }

    const stats = modelMap.get(modelId)
    stats.runs.push(run)
    if (review) {
      stats.total_human_score += review.weighted_total_score
      stats.review_count++
    }
    const techScore = await runValidation(dirName)
    if (techScore > 0) {
      stats.total_tech_score += techScore
      stats.tech_score_count++
    }
    if (new Date(run.run_date) > new Date(stats.latest_run_date)) {
      stats.latest_run_date = run.run_date
    }
  }

  const leaderboard = Array.from(modelMap.values()).map(stats => ({
    model_id: stats.model_id,
    run_count: stats.runs.length,
    average_human_score: stats.review_count > 0 ? stats.total_human_score / stats.review_count : 0,
    average_tech_score: stats.tech_score_count > 0 ? stats.total_tech_score / stats.tech_score_count : 0,
    latest_run_date: stats.latest_run_date
  }))

  return leaderboard.sort((a, b) => b.average_human_score - a.average_human_score)
}
