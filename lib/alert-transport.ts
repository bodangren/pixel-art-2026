import type { Alert } from './alert-store'

export type TransportType = 'webhook' | 'email'

export interface TransportConfig {
  type: TransportType
  url?: string
  apiUrl?: string
  fromAddress?: string
  retryCount?: number
  retryDelayMs?: number
}

export interface SendResult {
  success: boolean
  attempts: number
  error?: string
}

export class WebhookTransport {
  private url: string
  private retryCount: number
  private retryDelayMs: number

  constructor(config: TransportConfig & { url: string }) {
    this.url = config.url
    this.retryCount = config.retryCount ?? 0
    this.retryDelayMs = config.retryDelayMs ?? 1000
  }

  async send(alert: Alert): Promise<SendResult> {
    let attempts = 0

    for (let i = 0; i <= this.retryCount; i++) {
      attempts = i + 1
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert)
        })

        if (response.ok) {
          return { success: true, attempts }
        }

        if (i < this.retryCount) {
          await this.delay(this.retryDelayMs)
        }
      } catch (err) {
        if (i < this.retryCount) {
          await this.delay(this.retryDelayMs)
        } else {
          return { success: false, attempts, error: err instanceof Error ? err.message : String(err) }
        }
      }
    }

    return { success: false, attempts, error: 'Max retries exceeded' }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export class EmailTransport {
  private apiUrl: string
  private fromAddress: string

  constructor(config: TransportConfig & { apiUrl: string; fromAddress: string }) {
    this.apiUrl = config.apiUrl
    this.fromAddress = config.fromAddress
  }

  async send(alert: Alert, options: { to: string; subject?: string }): Promise<SendResult> {
    try {
      const body = this.formatAlert(alert)
      const subject = options.subject ?? `Benchmark Alert: ${alert.type} - ${alert.model_id}`

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: this.fromAddress,
          to: options.to,
          subject,
          body
        })
      })

      if (response.ok) {
        return { success: true, attempts: 1 }
      }

      return { success: false, attempts: 1, error: `HTTP ${response.status}` }
    } catch (err) {
      return {
        success: false,
        attempts: 1,
        error: err instanceof Error ? err.message : String(err)
      }
    }
  }

  formatAlert(alert: Alert): string {
    return [
      `Benchmark Alert: ${alert.type.toUpperCase()}`,
      `Model: ${alert.model_id}`,
      `Run: ${alert.run_id}`,
      `Severity: ${alert.severity}`,
      `Message: ${alert.message}`,
      `Time: ${alert.created_at}`,
      alert.metadata ? `Details: ${JSON.stringify(alert.metadata)}` : ''
    ].filter(Boolean).join('\n')
  }
}