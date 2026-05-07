import sharp from 'sharp'

export type DiffResult = number

async function loadGrayscale(buffer: Buffer): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const TARGET = 256
  const image = sharp(buffer)
  const metadata = await image.metadata()
  const w = metadata.width || 1
  const h = metadata.height || 1

  let resized = image
  if (w > TARGET || h > TARGET) {
    resized = image.resize(TARGET, TARGET, { fit: 'inside', withoutEnlargement: true })
  } else {
    resized = image.resize(TARGET, TARGET, { fit: 'cover', position: 'center' })
  }

  const { data, info } = await resized
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data: new Uint8ClampedArray(data), width: info.width, height: info.height }
}

function computeMSE(img1: Uint8ClampedArray, img2: Uint8ClampedArray): number {
  if (img1.length !== img2.length) return 1
  let sumSquaredDiff = 0
  for (let i = 0; i < img1.length; i++) {
    const diff = img1[i] - img2[i]
    sumSquaredDiff += diff * diff
  }
  return sumSquaredDiff / img1.length
}

export async function computeDiffScore(imagePath1: string, imagePath2: string): Promise<DiffResult> {
  const [buf1, buf2] = await Promise.all([
    sharp(imagePath1).toBuffer(),
    sharp(imagePath2).toBuffer()
  ])
  const { data: data1 } = await loadGrayscale(buf1)
  const { data: data2 } = await loadGrayscale(buf2)
  const targetLen = Math.max(data1.length, data2.length)
  const pad = (arr: Uint8ClampedArray, len: number) => {
    if (arr.length < len) {
      const padded = new Uint8ClampedArray(len)
      padded.set(arr)
      return padded
    }
    return arr
  }
  const d1 = pad(data1, targetLen)
  const d2 = pad(data2, targetLen)
  const mse = computeMSE(d1, d2)
  const maxMSE = 255 * 255
  const similarity = 1 - Math.min(mse / maxMSE, 1)
  return Math.round(similarity * 1000) / 1000
}

export async function generateDiffOverlay(imagePath1: string, imagePath2: string): Promise<Buffer> {
  const [buf1, buf2] = await Promise.all([
    sharp(imagePath1).toBuffer(),
    sharp(imagePath2).toBuffer()
  ])
  const size = 256
  const { data: data1, width, height } = await loadGrayscale(buf1)
  const { data: data2 } = await loadGrayscale(buf2)
  const targetLen = Math.max(data1.length, data2.length)
  const pad = (arr: Uint8ClampedArray, len: number) => {
    if (arr.length < len) {
      const padded = new Uint8ClampedArray(len)
      padded.set(arr)
      return padded
    }
    return arr
  }
  const d1 = pad(data1, targetLen)
  const d2 = pad(data2, targetLen)
  const diffPixels: number[] = []
  for (let i = 0; i < targetLen; i++) {
    if (Math.abs(d1[i] - d2[i]) > 10) {
      diffPixels.push(i)
    }
  }
  const overlay = Buffer.alloc(width * height * 4, 0)
  for (const idx of diffPixels) {
    const pixelIdx = idx * 4
    if (pixelIdx + 3 < overlay.length) {
      overlay[pixelIdx] = 255
      overlay[pixelIdx + 1] = 0
      overlay[pixelIdx + 2] = 0
      overlay[pixelIdx + 3] = 200
    }
  }
  return sharp(overlay, { raw: { width, height, channels: 4 } }).png().toBuffer()
}