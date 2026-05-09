import sharp from 'sharp'

export interface QualityFeatures {
  colorHistogram: number[]
  edgeDensity: number
  transparencyRatio: number
  gridAlignmentScore: number
  colorCount: number
  uniqueColorRatio: number
}

interface ImageStats {
  width: number
  height: number
  channels: number
  data: Buffer
}

async function getImageStats(buffer: Buffer): Promise<ImageStats> {
  const image = sharp(buffer)
  const meta = await image.metadata()
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true })

  return {
    width: info.width,
    height: info.height,
    channels: info.channels,
    data
  }
}

function computeColorHistogram(data: Buffer, channels: number): number[] {
  const histogram = new Array(64).fill(0)
  const factor = 256 / 4

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const bin = Math.min(Math.floor(r / factor) * 16 + Math.floor(g / factor) * 4 + Math.floor(b / factor), 63)
    histogram[bin]++
  }

  const total = histogram.reduce((a, b) => a + b, 0)
  return histogram.map(h => total > 0 ? h / total : 0)
}

function computeEdgeDensity(data: Buffer, width: number, height: number, channels: number): number {
  let edgePixels = 0
  const threshold = 30

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * channels
      const leftIdx = idx - channels
      const rightIdx = idx + channels
      const topIdx = ((y - 1) * width + x) * channels
      const bottomIdx = ((y + 1) * width + x) * channels

      let gradX = 0
      let gradY = 0

      for (let c = 0; c < 3; c++) {
        gradX += Math.abs(data[idx + c] - data[leftIdx + c])
        gradX += Math.abs(data[rightIdx + c] - data[idx + c])
        gradY += Math.abs(data[idx + c] - data[topIdx + c])
        gradY += Math.abs(data[bottomIdx + c] - data[idx + c])
      }

      if (gradX > threshold || gradY > threshold) {
        edgePixels++
      }
    }
  }

  return edgePixels / ((width - 2) * (height - 2))
}

function computeTransparencyRatio(data: Buffer, channels: number): number {
  if (channels < 4) return 0

  let transparentPixels = 0
  let totalPixels = 0

  for (let i = 0; i < data.length; i += channels) {
    totalPixels++
    if (data[i + 3] < 128) {
      transparentPixels++
    }
  }

  return totalPixels > 0 ? transparentPixels / totalPixels : 0
}

function computeGridAlignmentScore(width: number, height: number): number {
  const candidates = [2, 3, 4, 8, 16, 32, 64]
  let bestScore = 0

  for (const cells of candidates) {
    if (width % cells === 0 && height % cells === 0) {
      const cellWidth = width / cells
      const cellHeight = height / cells
      const cellRatio = Math.min(cellWidth, cellHeight) / Math.max(cellWidth, cellHeight)

      if (cellRatio >= 0.9) {
        const score = 1 - Math.abs(cellWidth - cellHeight) / Math.max(cellWidth, cellHeight)
        if (score > bestScore) {
          bestScore = score
        }
      }
    }
  }

  return bestScore
}

function countUniqueColors(data: Buffer, channels: number): { count: number; ratio: number } {
  const colors = new Set<string>()
  const totalPixels = data.length / channels

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    colors.add(`${r},${g},${b}`)
  }

  return {
    count: colors.size,
    ratio: colors.size / totalPixels
  }
}

export async function extractFeatures(buffer: Buffer): Promise<QualityFeatures> {
  const stats = await getImageStats(buffer)

  if (stats.width === 0 || stats.height === 0) {
    throw new Error('Invalid image dimensions')
  }

  const colorHistogram = computeColorHistogram(stats.data, stats.channels)
  const edgeDensity = computeEdgeDensity(stats.data, stats.width, stats.height, stats.channels)
  const transparencyRatio = computeTransparencyRatio(stats.data, stats.channels)
  const gridAlignmentScore = computeGridAlignmentScore(stats.width, stats.height)
  const uniqueColors = countUniqueColors(stats.data, stats.channels)

  return {
    colorHistogram,
    edgeDensity,
    transparencyRatio,
    gridAlignmentScore,
    colorCount: uniqueColors.count,
    uniqueColorRatio: uniqueColors.ratio
  }
}

export function featuresToVector(features: QualityFeatures): number[] {
  return [
    ...features.colorHistogram,
    features.edgeDensity,
    features.transparencyRatio,
    features.gridAlignmentScore,
    features.uniqueColorRatio,
    Math.log1p(features.colorCount) / 10
  ]
}