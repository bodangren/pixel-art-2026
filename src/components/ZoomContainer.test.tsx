import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ZoomContainer from './ZoomContainer'

describe('ZoomContainer Component', () => {
  const defaultProps = {
    src: '/test-sprite.png',
    width: 192,
    height: 192,
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders with initial zoom level of 1x', () => {
    render(<ZoomContainer {...defaultProps} />)
    expect(screen.getByLabelText(/zoom: 1x/i)).toBeInTheDocument()
  })

  it('renders zoom level buttons (1x, 2x, 4x, 8x, max)', () => {
    render(<ZoomContainer {...defaultProps} />)
    expect(screen.getByRole('button', { name: '1x' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2x' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4x' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '8x' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'max' })).toBeInTheDocument()
  })

  it('changes zoom level when buttons are clicked', () => {
    render(<ZoomContainer {...defaultProps} />)

    const button2x = screen.getByRole('button', { name: '2x' })
    fireEvent.click(button2x)
    expect(screen.getByLabelText(/zoom: 2x/i)).toBeInTheDocument()

    const buttonMax = screen.getByRole('button', { name: 'max' })
    fireEvent.click(buttonMax)
    expect(screen.getByLabelText(/zoom: max/i)).toBeInTheDocument()
  })

  it('displays image with pixelated rendering CSS', () => {
    render(<ZoomContainer {...defaultProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveStyle({ imageRendering: 'pixelated' })
  })

  it('shows grid overlay toggle button', () => {
    render(<ZoomContainer {...defaultProps} />)
    expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument()
  })

  it('enables grid overlay when grid button is clicked', () => {
    render(<ZoomContainer {...defaultProps} />)
    const gridButton = screen.getByRole('button', { name: /grid/i })
    fireEvent.click(gridButton)
    expect(gridButton).toHaveClass('bg-green-600')
  })

  it('does not show hover cell borders when grid is off', () => {
    render(<ZoomContainer {...defaultProps} />)
    const container = screen.getByLabelText(/zoom container/i)
    expect(container.querySelector('.hover\\:border-red-500')).toBeNull()
  })

  it('shows grid cells when grid is enabled for 3x3 asset', () => {
    render(<ZoomContainer {...defaultProps} is3x3Grid={true} showGrid={true} onShowGridChange={() => {}} />)
    const container = screen.getByLabelText(/zoom container/i)
    const gridOverlay = container.querySelector('.grid-cols-3')
    expect(gridOverlay).not.toBeNull()
    const cellDivs = container.querySelectorAll('[style*="33.333%"]')
    expect(cellDivs.length).toBe(9)
  })

  it('does not show grid overlay for non-3x3 asset', () => {
    render(<ZoomContainer {...defaultProps} is3x3Grid={false} showGrid={true} onShowGridChange={() => {}} />)
    const container = screen.getByLabelText(/zoom container/i)
    const gridOverlay = container.querySelector('.grid-cols-3')
    expect(gridOverlay).toBeNull()
  })

  it('shows 3x3 grid overlay when is3x3Grid and showGrid are true', () => {
    render(<ZoomContainer {...defaultProps} is3x3Grid={true} showGrid={true} onShowGridChange={() => {}} />)
    const container = screen.getByLabelText(/zoom container/i)
    const gridOverlay = container.querySelector('.grid-cols-3')
    expect(gridOverlay).not.toBeNull()
  })

  it('handles drag to pan when zoomed in', () => {
    render(<ZoomContainer {...defaultProps} />)

    const zoom8x = screen.getByRole('button', { name: '8x' })
    fireEvent.click(zoom8x)

    const img = screen.getByRole('img')
    const container = screen.getByLabelText(/zoom container/i)

    fireEvent.mouseDown(img, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(img, { clientX: 90, clientY: 90 })
    fireEvent.mouseUp(img)

    expect(container).toHaveStyle({ cursor: 'grab' })
  })
})