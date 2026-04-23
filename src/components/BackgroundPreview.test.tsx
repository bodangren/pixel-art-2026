import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BackgroundPreview from './BackgroundPreview'

describe('BackgroundPreview Component', () => {
  const defaultProps = {
    src: '/test-bg.png',
  }

  it('renders correctly with initial state', () => {
    render(<BackgroundPreview {...defaultProps} />)
    expect(screen.getByText(/Background Preview/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Background/i)).toBeInTheDocument()
  })

  it('toggles UI overlay', () => {
    render(<BackgroundPreview {...defaultProps} />)
    
    const overlayButton = screen.getByText(/Show UI Overlay/i)
    fireEvent.click(overlayButton)
    
    expect(screen.getByText(/Hide UI Overlay/i)).toBeInTheDocument()
    expect(screen.getByText(/HP: 100\/100/i)).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/Hide UI Overlay/i))
    expect(screen.queryByText(/HP: 100\/100/i)).not.toBeInTheDocument()
  })

  it('updates zoom correctly', () => {
    render(<BackgroundPreview {...defaultProps} />)
    
    const zoomInput = screen.getByLabelText(/Zoom: 100%/i)
    fireEvent.change(zoomInput, { target: { value: '0.5' } })
    
    expect(screen.getByText(/Zoom: 50%/i)).toBeInTheDocument()
  })
})
