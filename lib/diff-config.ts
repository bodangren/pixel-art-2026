export interface DiffThresholds {
  background: number
  hero: number
  enemy: number
  effect: number
}

export const defaultDiffThresholds: DiffThresholds = {
  background: 0.95,
  hero: 0.90,
  enemy: 0.90,
  effect: 0.90
}

export function getThreshold(assetType: keyof DiffThresholds, custom?: Partial<DiffThresholds>): number {
  if (custom && assetType in custom) {
    return custom[assetType]!
  }
  return defaultDiffThresholds[assetType]
}

export function isRegressed(diffScore: number, threshold: number): boolean {
  return diffScore < threshold
}