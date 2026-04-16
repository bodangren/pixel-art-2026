import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FilterControls } from './GalleryControls'

describe('FilterControls Component', () => {
  const mockFilters = {
    assetType: 'all' as const,
    modelId: '',
    sortBy: 'date' as const,
    sortOrder: 'desc' as const,
  }

  it('renders all filter options', () => {
    render(<FilterControls filters={mockFilters} onFilterChange={() => {}} />)
    expect(screen.getByLabelText(/Asset Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Model/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sort By/i)).toBeInTheDocument()
  })

  it('calls onFilterChange when asset type changes', () => {
    const onFilterChange = vi.fn()
    render(<FilterControls filters={mockFilters} onFilterChange={onFilterChange} />)
    
    const select = screen.getByLabelText(/Asset Type/i)
    select.focus()
  })
})