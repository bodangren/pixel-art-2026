import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewTools from './ReviewTools'

describe('ReviewTools Component', () => {
  const defaultProps = {
    zoom: 1,
    onZoomChange: vi.fn(),
    showGrid: false,
    onGridToggle: vi.fn(),
    showCheckerboard: true,
    onCheckerboardToggle: vi.fn(),
  }

  it('renders all controls', () => {
    render(<ReviewTools {...defaultProps} />)
    expect(screen.getByLabelText(/Zoom: 100%/i)).toBeInTheDocument()
    expect(screen.getByText(/Grid/i)).toBeInTheDocument()
    expect(screen.getByText(/Checkerboard/i)).toBeInTheDocument()
  })

  it('calls onZoomChange when slider moves', () => {
    render(<ReviewTools {...defaultProps} />)
    const zoomInput = screen.getByLabelText(/Zoom: 100%/i)
    fireEvent.change(zoomInput, { target: { value: '2' } })
    expect(defaultProps.onZoomChange).toHaveBeenCalledWith(2)
  })

  it('calls onGridToggle when grid button clicked', () => {
    render(<ReviewTools {...defaultProps} />)
    const gridButton = screen.getByText(/Grid/i)
    fireEvent.click(gridButton)
    expect(defaultProps.onGridToggle).toHaveBeenCalled()
  })

  it('calls onCheckerboardToggle when checkerboard button clicked', () => {
    render(<ReviewTools {...defaultProps} />)
    const checkerButton = screen.getByText(/Checkerboard/i)
    fireEvent.click(checkerButton)
    expect(defaultProps.onCheckerboardToggle).toHaveBeenCalled()
  })
})
