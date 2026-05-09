import { extractFeatures, featuresToVector, type QualityFeatures } from './quality-features'
import fs from 'fs/promises'
import path from 'path'

export interface QualityScore {
  score: number
  confidence: 'high' | 'medium' | 'low'
  features: QualityFeatures
  modelVersion: string
}

const MODEL_VERSION = '1.0.0'
const WEIGHTS_PATH = path.join(process.cwd(), 'public/models/quality-scorer-weights.json')

const DEFAULT_WEIGHTS = {
  colorHistogram: new Array(64).fill(0).map((_, i) => (i < 10 ? 0.3 : 0.1)),
  edgeDensity: 0.15,
  transparencyRatio: 0.2,
  gridAlignmentScore: 0.25,
  uniqueColorRatio: 0.1
}

let cachedWeights: Record<string, number[]> | null = null

async function loadWeights(): Promise<Record<string, number[]>> {
  if (cachedWeights) return cachedWeights

  try {
    const content = await fs.readFile(WEIGHTS_PATH, 'utf-8')
    cachedWeights = JSON.parse(content)
    return cachedWeights
  } catch {
    return DEFAULT_WEIGHTS
  }
}

function computeScore(features: QualityFeatures, weights: Record<string, number[]>): number {
  const vector = featuresToVector(features)
  const weightVector = [
    ...weights.colorHistogram || DEFAULT_WEIGHTS.colorHistogram,
    weights.edgeDensity ?? DEFAULT_WEIGHTS.edgeDensity,
    weights.transparencyRatio ?? DEFAULT_WEIGHTS.transparencyRatio,
    weights.gridAlignmentScore ?? DEFAULT_WEIGHTS.gridAlignmentScore,
    weights.uniqueColorRatio ?? DEFAULT_WEIGHTS.uniqueColorRatio,
    0.1
  ]

  let score = 0
  const minLen = Math.min(vector.length, weightVector.length)
  for (let i = 0; i < minLen; i++) {
    score += vector[i] * weightVector[i]
  }

  return Math.max(0, Math.min(100, score * 100))
}

function computeConfidence(features: QualityFeatures): 'high' | 'medium' | 'low' {
  const distinctColors = features.colorCount

  if (distinctColors >= 8 && distinctColors <= 64) {
    return 'high'
  }
  if (distinctColors >= 4 && distinctColors <= 128) {
    return 'medium'
  }
  return 'low'
}

export async function scoreAsset(buffer: Buffer): Promise<QualityScore> {
  const features = await extractFeatures(buffer)
  const weights = await loadWeights()
  const score = computeScore(features, weights)
  const confidence = computeConfidence(features)

  return {
    score: Math.round(score * 10) / 10,
    confidence,
    features,
    modelVersion: MODEL_VERSION
  }
}

export function isLikelyFailure(score: QualityScore): boolean {
  return score.score < 40
}

export async function scoreBatch(
  buffers: Buffer[]
): Promise<{ scores: QualityScore[]; meanScore: number; likelyFailures: number }> {
  const scores = await Promise.all(buffers.map(buf => scoreAsset(buf)))
  const meanScore = scores.length > 0
    ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
    : 0
  const likelyFailures = scores.filter(isLikelyFailure).length

  return {
    scores,
    meanScore: Math.round(meanScore * 10) / 10,
    likelyFailures
  }
}