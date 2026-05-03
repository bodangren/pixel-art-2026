import { describe, it, expect } from 'vitest'
import { toCsv, toJsonExport } from './export'

describe('toCsv', () => {
  it('converts array of objects to CSV string with headers', () => {
    const data = [
      { name: 'Alice', score: 100 },
      { name: 'Bob', score: 85 }
    ]
    const csv = toCsv(data)
    expect(csv).toContain('name,score')
    expect(csv).toContain('Alice,100')
    expect(csv).toContain('Bob,85')
  })

  it('handles special characters (commas, quotes, newlines)', () => {
    const data = [
      { description: 'Has, comma', note: 'Say "Hello"' },
      { description: 'Line\nbreak', note: 'Normal' }
    ]
    const csv = toCsv(data)
    expect(csv).toContain('"Has, comma"')
    expect(csv).toContain('"Say ""Hello"""')
    expect(csv).toContain('"Line\nbreak"')
  })

  it('handles empty array', () => {
    const csv = toCsv([])
    expect(csv).toBe('')
  })
})

describe('toJsonExport', () => {
  it('produces valid JSON with metadata timestamp', () => {
    const data = { models: ['A', 'B'] }
    const json = toJsonExport(data)
    const parsed = JSON.parse(json)
    expect(parsed.data).toEqual(data)
    expect(parsed.timestamp).toBeTruthy()
  })

  it('includes custom metadata', () => {
    const data = { score: 42 }
    const json = toJsonExport(data, { source: 'leaderboard', timestamp: '2026-05-03T00:00:00Z' })
    const parsed = JSON.parse(json)
    expect(parsed.source).toBe('leaderboard')
    expect(parsed.timestamp).toBe('2026-05-03T00:00:00Z')
  })
})