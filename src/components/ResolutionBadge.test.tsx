import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResolutionBadge from './ResolutionBadge'

describe('ResolutionBadge Component', () => {
  it('should render resolution value', () => {
    render(<ResolutionBadge resolution="64x64" />)
    expect(screen.getByText('64x64')).toBeTruthy()
  })

  it('should apply correct size classes for sm size', () => {
    const { container } = render(<ResolutionBadge resolution="32x32" size="sm" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('text-[10px]')
  })

  it('should apply correct size classes for md size', () => {
    const { container } = render(<ResolutionBadge resolution="128x128" size="md" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('text-xs')
  })

  it('should render different resolution values', () => {
    for (const res of ['32x32', '64x64', '128x128']) {
      const { container } = render(<ResolutionBadge resolution={res} />)
      const span = container.querySelector('span')
      expect(span?.textContent).toBe(res)
    }
  })
})