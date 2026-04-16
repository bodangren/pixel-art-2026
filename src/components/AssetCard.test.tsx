import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AssetCard from './AssetCard'

describe('AssetCard Component', () => {
  const mockAsset = {
    assetKey: 'hero',
    path: 'hero_sprite.png',
    fullPath: '/data/runs/run_001/hero_sprite.png',
    isBackground: false,
    isSheet: true,
    rows: 3,
    cols: 3,
    frameSize: 64,
  }

  it('renders asset key as title', () => {
    render(<AssetCard {...mockAsset} />)
    expect(screen.getByText('hero')).toBeInTheDocument()
  })

  it('renders SpriteSheetPreview for sprite sheets', () => {
    render(<AssetCard {...mockAsset} />)
    expect(screen.getByText(/Sprite Animation/i)).toBeInTheDocument()
  })

  it('renders static image for non-sheet assets', () => {
    render(<AssetCard {...mockAsset} isSheet={false} />)
    expect(screen.getByText(/Static Asset/i)).toBeInTheDocument()
  })

  it('renders BackgroundPreview for background assets', () => {
    render(<AssetCard {...mockAsset} isBackground={true} isSheet={false} />)
    expect(screen.getByText(/Background Preview/i)).toBeInTheDocument()
  })

  it('applies correct grid classes for background assets', () => {
    render(<AssetCard {...mockAsset} isBackground={true} />)
    const container = screen.getByTestId('asset-card')
    expect(container.className).toContain('md:col-span-2')
  })
})