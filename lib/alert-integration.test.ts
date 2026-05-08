import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AlertRulesEngine } from './alert-rules'
import { saveAlert, getAllAlerts, clearAllAlerts, type Alert } from './alert-store'
import { WebhookTransport } from './alert-transport'

describe('Alert Integration', () => {
  beforeEach(() => {
    clearAllAlerts()
    vi.clearAllMocks()
  })

  it('full pipeline: detect regression -> save to store -> delivered via webhook', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    global.fetch = mockFetch

    const engine = new AlertRulesEngine({ regressionThreshold: 0.05 })
    const runs = [
      { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 4.0, run_date: '2026-05-01' },
      { run_id: 'r2', model_id: 'gpt-4o', average_human_score: 3.7, run_date: '2026-05-02' }
    ]
    const alerts = engine.detectRegression(runs)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].type).toBe('regression')

    const saved = saveAlert(alerts[0])
    expect(saved.id).toBe(alerts[0].id)

    const stored = getAllAlerts()
    expect(stored).toHaveLength(1)
    expect(stored[0].model_id).toBe('gpt-4o')

    const transport = new WebhookTransport({ url: 'https://example.com/hook' })
    const result = await transport.send(stored[0])
    expect(result.success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/hook',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('full pipeline: detect failure -> save to store -> delivered via webhook', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    global.fetch = mockFetch

    const engine = new AlertRulesEngine({})
    const runs = [
      { run_id: 'r1', model_id: 'claude-3.5', status: 'failed' as const, run_date: '2026-05-01' }
    ]
    const alerts = engine.detectFailures(runs)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].severity).toBe('critical')

    saveAlert(alerts[0])
    const stored = getAllAlerts()
    expect(stored).toHaveLength(1)
    expect(stored[0].type).toBe('failure')

    const transport = new WebhookTransport({ url: 'https://example.com/hook' })
    const result = await transport.send(stored[0])
    expect(result.success).toBe(true)
  })

  it('handles multiple alerts across models', () => {
    const engine = new AlertRulesEngine({ regressionThreshold: 0.05 })

    const runs = [
      { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 4.0, run_date: '2026-05-01' },
      { run_id: 'r2', model_id: 'gpt-4o', average_human_score: 3.7, run_date: '2026-05-02' },
      { run_id: 'r3', model_id: 'claude-3.5', average_human_score: 4.5, run_date: '2026-05-01' },
      { run_id: 'r4', model_id: 'claude-3.5', average_human_score: 4.2, run_date: '2026-05-02' }
    ]

    const regressionAlerts = engine.detectRegression(runs)
    const failedRuns = runs.filter(r => r.status === 'failed')
    const failureAlerts = engine.detectFailures(failedRuns)

    const allAlerts = [...regressionAlerts, ...failureAlerts]

    for (const alert of allAlerts) {
      saveAlert(alert)
    }

    const stored = getAllAlerts()
    expect(stored).toHaveLength(2)

    const gptAlerts = stored.filter(a => a.model_id === 'gpt-4o')
    const claudeAlerts = stored.filter(a => a.model_id === 'claude-3.5')
    expect(gptAlerts).toHaveLength(1)
    expect(claudeAlerts).toHaveLength(1)
  })

  it('webhook transport retries on failure', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 })
    global.fetch = mockFetch

    const alert: Alert = {
      id: 'test-alert',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'high',
      message: 'Test',
      created_at: '2026-05-08T10:00:00Z'
    }

    saveAlert(alert)

    const transport = new WebhookTransport({
      url: 'https://example.com/hook',
      retryCount: 2,
      retryDelayMs: 10
    })

    const result = await transport.send(alert)
    expect(result.success).toBe(true)
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('alert with metadata round-trips through store', () => {
    const engine = new AlertRulesEngine({ regressionThreshold: 0.05 })
    const runs = [
      { run_id: 'r1', model_id: 'gpt-4o', average_human_score: 4.0, run_date: '2026-05-01' },
      { run_id: 'r2', model_id: 'gpt-4o', average_human_score: 3.5, run_date: '2026-05-02' }
    ]

    const alerts = engine.detectRegression(runs)
    expect(alerts[0].metadata).toBeDefined()
    expect(alerts[0].metadata?.dropPercent).toBeDefined()

    saveAlert(alerts[0])
    const stored = getAllAlerts()

    expect(stored[0].metadata).toEqual(alerts[0].metadata)
  })
})