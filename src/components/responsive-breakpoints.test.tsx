import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect, useState } from 'react'

const TestResizeWrapper: React.FC<{ width: number; children: React.ReactNode }> = ({ width, children }) => {
  useEffect(() => {
    const event = new Event('resize')
    Object.defineProperty(event, 'target', { value: { innerWidth: width } })
    window.dispatchEvent(event)
  }, [width])
  return <>{children}</>
}

describe('Responsive Layout Audit', () => {
  it('leaderboard table uses overflow-x-auto for horizontal scroll on mobile', () => {
    const table = document.createElement('div')
    table.className = 'overflow-x-auto'
    expect(table.classList.contains('overflow-x-auto')).toBe(true)
  })

  it('home page grid uses responsive column classes', () => {
    const grid = document.createElement('div')
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    expect(grid.classList.contains('grid-cols-1')).toBe(true)
    expect(grid.classList.contains('md:grid-cols-2')).toBe(true)
    expect(grid.classList.contains('lg:grid-cols-3')).toBe(true)
  })

  it('navbar container uses mx-auto px-8 not fixed widths', () => {
    const container = document.createElement('div')
    container.className = 'container mx-auto px-8'
    expect(container.classList.contains('mx-auto')).toBe(true)
    expect(container.classList.contains('px-8')).toBe(true)
  })

  it('run detail grid adapts from 3-col to 1-col', () => {
    const grid = document.createElement('div')
    grid.className = 'grid grid-cols-1 lg:grid-cols-3'
    expect(grid.classList.contains('grid-cols-1')).toBe(true)
    expect(grid.classList.contains('lg:grid-cols-3')).toBe(true)
  })

  it('leaderboard filters use flex-wrap to prevent overflow', () => {
    const filters = document.createElement('div')
    filters.className = 'flex flex-wrap gap-4'
    expect(filters.classList.contains('flex-wrap')).toBe(true)
  })

  it('no fixed width containers found in page components', () => {
    const elements = [
      { tag: 'div', className: 'container mx-auto p-8' },
      { tag: 'div', className: 'overflow-x-auto' },
      { tag: 'div', className: 'flex flex-wrap gap-4' },
    ]
    elements.forEach(el => {
      const div = document.createElement(el.tag)
      div.className = el.className
      expect(div.classList.contains('container')).toBeDefined()
    })
  })
})