export async function validateAssets(
  assetPaths: Record<string, string>,
  getMetadata: (path: string) => Promise<{ width?: number; height?: number }>
) {
  const errors: string[] = []
  const specs: Record<string, { width: number; height: number }> = {
    background: { width: 390, height: 700 },
    hero: { width: 192, height: 192 },
    enemy: { width: 192, height: 192 },
    effect: { width: 144, height: 48 }
  }

  for (const [key, path] of Object.entries(assetPaths)) {
    const spec = specs[key]
    if (!spec) continue

    try {
      const meta = await getMetadata(path)
      // Debug
      // console.log(`Validating ${key} (${path}): expected ${spec.width}x${spec.height}, got ${meta.width}x${meta.height}`);
      
      if (!meta || meta.width !== spec.width || meta.height !== spec.height) {
        errors.push(`${path}: Expected ${spec.width}x${spec.height}, got ${meta?.width}x${meta?.height}`)
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
