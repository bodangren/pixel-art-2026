export type Resolution = '32x32' | '64x64' | '128x128'

export const RESOLUTION_SPECS: Record<Resolution, Record<string, { width: number; height: number }>> = {
  '32x32': {
    background: { width: 390, height: 700 },
    hero: { width: 96, height: 96 },
    enemy: { width: 96, height: 96 },
    effect: { width: 72, height: 24 }
  },
  '64x64': {
    background: { width: 390, height: 700 },
    hero: { width: 192, height: 192 },
    enemy: { width: 192, height: 192 },
    effect: { width: 144, height: 48 }
  },
  '128x128': {
    background: { width: 390, height: 700 },
    hero: { width: 384, height: 384 },
    enemy: { width: 384, height: 384 },
    effect: { width: 288, height: 96 }
  }
}

export async function validateAssets(
  assetPaths: Record<string, string>,
  getMetadata: (path: string) => Promise<{ width?: number; height?: number }>,
  specs?: Record<string, { width: number; height: number }>
) {
  const errors: string[] = []
  const resolutionSpec = specs || RESOLUTION_SPECS['64x64']

  for (const [key, path] of Object.entries(assetPaths)) {
    const specItem = resolutionSpec[key]
    if (!specItem) continue

    try {
      const meta = await getMetadata(path)
      
      if (!meta || meta.width !== specItem.width || meta.height !== specItem.height) {
        errors.push(`${path}: Expected ${specItem.width}x${specItem.height}, got ${meta?.width}x${meta?.height}`)
      }
    } catch (e: any) {
      errors.push(`${path}: Failed to read metadata - ${e.message}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
