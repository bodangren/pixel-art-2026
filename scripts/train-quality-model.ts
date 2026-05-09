#!/usr/bin/env bun
/**
 * Quality Model Training Script
 *
 * Trains a lightweight scoring model using historical human review data.
 * Outputs weights to public/models/quality-scorer-weights.json
 *
 * Usage:
 *   bun run scripts/train-quality-model.ts
 */

import { extractFeatures, featuresToVector, type QualityFeatures } from '../lib/quality-features'
import fs from 'fs/promises'
import path from 'path'

interface TrainingExample {
  features: QualityFeatures
  humanScore: number
}

const DATA_DIR = path.join(process.cwd(), 'public/data/runs')
const WEIGHTS_PATH = path.join(process.cwd(), 'public/models/quality-scorer-weights.json')
const OUTPUT_DIR = path.dirname(WEIGHTS_PATH)

async function loadTrainingData(): Promise<TrainingExample[]> {
  const examples: TrainingExample[] = []

  try {
    const runDirs = await fs.readdir(DATA_DIR)
    const processedRuns = new Set<string>()

    for (const runDir of runDirs) {
      if (!runDir.includes('__')) continue

      const runPath = path.join(DATA_DIR, runDir)
      const runStat = await fs.stat(runPath)

      if (!runStat.isDirectory()) continue

      const runId = runDir
      if (processedRuns.has(runId)) continue
      processedRuns.add(runId)

      const reviewPath = path.join(runPath, 'review.json')
      let humanScore: number | null = null

      try {
        const reviewContent = await fs.readFile(reviewPath, 'utf-8')
        const review = JSON.parse(reviewContent)
        humanScore = review.weighted_total_score
      } catch {
        continue
      }

      if (humanScore === null) continue

      const assetPath = path.join(runPath, 'assets')
      let assetFiles: string[] = []
      try {
        assetFiles = (await fs.readdir(assetPath)).filter(f => f.endsWith('.png'))
      } catch {
        continue
      }

      if (assetFiles.length === 0) continue

      const featureBuffers: QualityFeatures[] = []
      for (const assetFile of assetFiles.slice(0, 4)) {
        try {
          const assetBuffer = await fs.readFile(path.join(assetPath, assetFile))
          const features = await extractFeatures(assetBuffer)
          featureBuffers.push(features)
        } catch {
          continue
        }
      }

      if (featureBuffers.length === 0) continue

      const avgFeatures: QualityFeatures = {
        colorHistogram: new Array(64).fill(0),
        edgeDensity: 0,
        transparencyRatio: 0,
        gridAlignmentScore: 0,
        colorCount: 0,
        uniqueColorRatio: 0
      }

      for (const fb of featureBuffers) {
        for (let i = 0; i < 64; i++) {
          avgFeatures.colorHistogram[i] += fb.colorHistogram[i] / featureBuffers.length
        }
        avgFeatures.edgeDensity += fb.edgeDensity / featureBuffers.length
        avgFeatures.transparencyRatio += fb.transparencyRatio / featureBuffers.length
        avgFeatures.gridAlignmentScore += fb.gridAlignmentScore / featureBuffers.length
        avgFeatures.colorCount += fb.colorCount / featureBuffers.length
        avgFeatures.uniqueColorRatio += fb.uniqueColorRatio / featureBuffers.length
      }

      examples.push({ features: avgFeatures, humanScore })
    }
  } catch (e) {
    console.error('Error loading training data:', e)
  }

  return examples
}

function trainLinearWeights(examples: TrainingExample[]): Record<string, number[]> {
  if (examples.length < 3) {
    console.warn('Insufficient training examples, using default weights')
    return {
      colorHistogram: new Array(64).fill(0).map((_, i) => (i < 10 ? 0.3 : 0.1)),
      edgeDensity: 0.15,
      transparencyRatio: 0.2,
      gridAlignmentScore: 0.25,
      uniqueColorRatio: 0.1
    }
  }

  const featureVectors = examples.map(e => featuresToVector(e.features))
  const scores = examples.map(e => e.humanScore)

  const dim = featureVectors[0].length
  const weights = new Array(dim).fill(0.1)

  const learningRate = 0.0001
  const iterations = 500

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < featureVectors.length; i++) {
      const vec = featureVectors[i]
      const target = scores[i] / 100

      let pred = 0
      for (let j = 0; j < dim; j++) {
        pred += vec[j] * weights[j]
      }
      pred = Math.max(0.01, Math.min(1, pred))

      const error = pred - target
      for (let j = 0; j < dim; j++) {
        weights[j] -= learningRate * error * vec[j]
      }
    }
  }

  const maxWeight = Math.max(...weights.map(w => Math.abs(w)))
  if (maxWeight > 0.01) {
    const scale = 0.5 / maxWeight
    for (let j = 0; j < dim; j++) {
      weights[j] *= scale
    }
  }

  return {
    colorHistogram: weights.slice(0, 64),
    edgeDensity: weights[64] || 0.15,
    transparencyRatio: weights[65] || 0.2,
    gridAlignmentScore: weights[66] || 0.25,
    uniqueColorRatio: weights[67] || 0.1
  }
}

async function main() {
  console.log('Loading training data...')
  const examples = await loadTrainingData()
  console.log(`Loaded ${examples.length} training examples`)

  if (examples.length === 0) {
    console.log('No training data found. Creating default weights.')
    const defaultWeights = {
      colorHistogram: new Array(64).fill(0).map((_, i) => (i < 10 ? 0.3 : 0.1)),
      edgeDensity: 0.15,
      transparencyRatio: 0.2,
      gridAlignmentScore: 0.25,
      uniqueColorRatio: 0.1
    }
    await fs.mkdir(OUTPUT_DIR, { recursive: true })
    await fs.writeFile(WEIGHTS_PATH, JSON.stringify(defaultWeights, null, 2))
    console.log(`Weights written to ${WEIGHTS_PATH}`)
    return
  }

  console.log('Training model...')
  const weights = trainLinearWeights(examples)

  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.writeFile(WEIGHTS_PATH, JSON.stringify(weights, null, 2))
  console.log(`Weights written to ${WEIGHTS_PATH}`)
  console.log('Training complete!')
}

main().catch(console.error)