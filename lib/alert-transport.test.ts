import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WebhookTransport, EmailTransport, type TransportConfig } from './alert-transport'

describe('WebhookTransport', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('delivers alert to webhook URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200
    })

    const transport = new WebhookTransport({
      url: 'https://example.com/webhook',
      retryCount: 0
    })

    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression' as const,
      severity: 'high' as const,
      message: 'Score dropped 10%',
      created_at: '2026-05-08T10:00:00Z'
    }

    const result = await transport.send(alert)
    expect(result.success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      })
    )
  })

  it('retries on failure when retryCount > 0', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 })

    const transport = new WebhookTransport({
      url: 'https://example.com/webhook',
      retryCount: 3,
      retryDelayMs: 10
    })

    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression' as const,
      severity: 'high' as const,
      message: 'Test',
      created_at: '2026-05-08T10:00:00Z'
    }

    const result = await transport.send(alert)
    expect(result.success).toBe(true)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('returns failure after exhausting retries', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 })

    const transport = new WebhookTransport({
      url: 'https://example.com/webhook',
      retryCount: 2,
      retryDelayMs: 10
    })

    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression' as const,
      severity: 'high' as const,
      message: 'Test',
      created_at: '2026-05-08T10:00:00Z'
    }

    const result = await transport.send(alert)
    expect(result.success).toBe(false)
    expect(result.attempts).toBe(3)
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'))

    const transport = new WebhookTransport({
      url: 'https://example.com/webhook',
      retryCount: 1,
      retryDelayMs: 10
    })

    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'failure' as const,
      severity: 'critical' as const,
      message: 'Test',
      created_at: '2026-05-08T10:00:00Z'
    }

    const result = await transport.send(alert)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Network failure')
  })
})

describe('EmailTransport', () => {
  it('sends email via external API (mock)', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200
    })

    const transport = new EmailTransport({
      apiUrl: 'https://email.example.com/send',
      fromAddress: 'alerts@pixel-art.dev'
    })

    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'completion' as const,
      severity: 'low' as const,
      message: 'Benchmark run completed',
      created_at: '2026-05-08T10:00:00Z'
    }

    const result = await transport.send(alert, {
      to: 'admin@example.com',
      subject: 'Benchmark Alert'
    })

    expect(result.success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://email.example.com/send',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('admin@example.com')
      })
    )
  })

  it('formats alert message correctly', () => {
    const transport = new EmailTransport({
      apiUrl: 'https://email.example.com/send',
      fromAddress: 'alerts@pixel-art.dev'
    })

    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression' as const,
      severity: 'high' as const,
      message: 'Score dropped 10%',
      created_at: '2026-05-08T10:00:00Z'
    }

    const formatted = transport.formatAlert(alert)
    expect(formatted).toContain('REGRESSION')
    expect(formatted).toContain('gpt-4o')
    expect(formatted).toContain('Score dropped 10%')
  })
})

describe('TransportConfig', () => {
  it('accepts valid webhook config', () => {
    const config: TransportConfig = {
      type: 'webhook',
      url: 'https://example.com/webhook',
      retryCount: 3
    }
    expect(config.type).toBe('webhook')
    expect(config.url).toBe('https://example.com/webhook')
  })

  it('accepts valid email config', () => {
    const config: TransportConfig = {
      type: 'email',
      apiUrl: 'https://email.example.com/send',
      fromAddress: 'alerts@example.com'
    }
    expect(config.type).toBe('email')
    expect(config.apiUrl).toBe('https://email.example.com/send')
  })
})