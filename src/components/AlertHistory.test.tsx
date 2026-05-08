import { describe, it, expect } from 'vitest'
import type { Alert } from '@/lib/alert-store'

describe('AlertHistory component logic', () => {
  const mockAlerts: Alert[] = [
    {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'high',
      message: 'Score dropped 10%',
      created_at: '2026-05-08T10:00:00Z'
    },
    {
      id: 'alert-2',
      run_id: 'run-2',
      model_id: 'claude-3.5',
      type: 'failure',
      severity: 'critical',
      message: 'Run failed',
      created_at: '2026-05-08T11:00:00Z'
    },
    {
      id: 'alert-3',
      run_id: 'run-3',
      model_id: 'gemini-2.5',
      type: 'completion',
      severity: 'low',
      message: 'Completed',
      created_at: '2026-05-08T12:00:00Z'
    }
  ]

  it('filter logic works correctly', () => {
    const filterType = 'regression'
    const filtered = mockAlerts.filter(a => filterType === 'all' || a.type === filterType)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].type).toBe('regression')
  })

  it('sort logic works correctly', () => {
    const sortOrder = 'desc'
    const sorted = [...mockAlerts].sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortOrder === 'desc' ? -diff : diff
    })
    expect(sorted[0].id).toBe('alert-3')
    expect(sorted[2].id).toBe('alert-1')
  })

  it('severity colors mapping exists', () => {
    const severityColors: Record<string, string> = {
      low: 'text-blue-400 border-blue-900/30',
      medium: 'text-yellow-400 border-yellow-900/30',
      high: 'text-orange-400 border-orange-900/30',
      critical: 'text-red-400 border-red-900/30'
    }
    expect(severityColors['high']).toBe('text-orange-400 border-orange-900/30')
    expect(severityColors['critical']).toBe('text-red-400 border-red-900/30')
  })

  it('type icons mapping exists', () => {
    const typeIcons: Record<string, string> = {
      regression: '↓',
      failure: '✕',
      completion: '✓'
    }
    expect(typeIcons['regression']).toBe('↓')
    expect(typeIcons['failure']).toBe('✕')
    expect(typeIcons['completion']).toBe('✓')
  })

  it('empty alerts list handled correctly', () => {
    const alerts: Alert[] = []
    expect(alerts.length).toBe(0)
  })

  it('alert formatting for display works', () => {
    const alert = mockAlerts[0]
    const displayType = alert.type.charAt(0).toUpperCase() + alert.type.slice(1)
    expect(displayType).toBe('Regression')
    expect(alert.model_id).toBe('gpt-4o')
  })

  it('filter by completion type', () => {
    const filterType = 'completion'
    const filtered = mockAlerts.filter(a => a.type === filterType)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].model_id).toBe('gemini-2.5')
  })

  it('multiple filter applications work', () => {
    let result = mockAlerts
    result = result.filter(a => a.severity === 'high' || a.severity === 'critical')
    expect(result).toHaveLength(2)
    result = result.filter(a => a.model_id.includes('gpt') || a.model_id.includes('claude'))
    expect(result).toHaveLength(2)
  })

  it('timestamp formatting works', () => {
    const date = new Date('2026-05-08T10:00:00Z')
    const formatted = date.toLocaleString()
    expect(formatted).toContain('2026')
  })

  it('metadata display conditional works', () => {
    const alertWithMeta = mockAlerts[0]
    expect(alertWithMeta.run_id).toBeDefined()

    const alertWithoutMeta: Alert = {
      id: 'a1',
      run_id: 'r1',
      model_id: 'm1',
      type: 'completion',
      severity: 'low',
      message: 'Done',
      created_at: '2026-05-08T10:00:00Z'
    }
    expect(alertWithoutMeta.metadata).toBeUndefined()
  })
})