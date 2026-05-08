import { describe, it, expect, beforeEach } from 'vitest'
import {
  alertSchema,
  alertSubscriptionSchema,
  saveAlert,
  getAlert,
  getAllAlerts,
  getAlertsByModel,
  deleteAlert,
  saveSubscription,
  getSubscriptions,
  getSubscriptionsForModel,
  deleteSubscription,
  clearAllAlerts,
  clearAllSubscriptions
} from './alert-store'

describe('alertSchema', () => {
  it('parses valid alert object', () => {
    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'high',
      message: 'Score dropped 10%',
      created_at: '2026-05-08T10:00:00Z',
      metadata: { dropPercent: 10 }
    }
    const result = alertSchema.safeParse(alert)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.id).toBe('alert-1')
      expect(result.data.type).toBe('regression')
    }
  })

  it('rejects invalid alert type', () => {
    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'invalid_type',
      severity: 'high',
      message: 'Test',
      created_at: '2026-05-08T10:00:00Z'
    }
    const result = alertSchema.safeParse(alert)
    expect(result.success).toBe(false)
  })

  it('rejects invalid severity', () => {
    const alert = {
      id: 'alert-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'super_critical',
      message: 'Test',
      created_at: '2026-05-08T10:00:00Z'
    }
    const result = alertSchema.safeParse(alert)
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const alert = {
      id: 'alert-1',
      type: 'regression'
    }
    const result = alertSchema.safeParse(alert)
    expect(result.success).toBe(false)
  })
})

describe('alertSubscriptionSchema', () => {
  it('parses valid webhook subscription', () => {
    const subscription = {
      userId: 'user-1',
      modelId: 'gpt-4o',
      alertTypes: ['regression', 'failure'],
      transportType: 'webhook',
      webhookUrl: 'https://example.com/hook',
      enabled: true
    }
    const result = alertSubscriptionSchema.safeParse(subscription)
    expect(result.success).toBe(true)
  })

  it('parses valid email subscription', () => {
    const subscription = {
      userId: 'user-1',
      modelId: 'gpt-4o',
      alertTypes: ['completion'],
      transportType: 'email',
      emailTo: 'admin@example.com',
      enabled: true
    }
    const result = alertSubscriptionSchema.safeParse(subscription)
    expect(result.success).toBe(true)
  })

  it('rejects invalid alert type in subscription', () => {
    const subscription = {
      userId: 'user-1',
      modelId: 'gpt-4o',
      alertTypes: ['invalid'],
      transportType: 'webhook',
      webhookUrl: 'https://example.com/hook',
      enabled: true
    }
    const result = alertSubscriptionSchema.safeParse(subscription)
    expect(result.success).toBe(false)
  })
})

describe('Alert store functions', () => {
  beforeEach(() => {
    clearAllAlerts()
    clearAllSubscriptions()
  })

  it('saveAlert and getAlert work', () => {
    const alert = {
      id: 'test-1',
      run_id: 'run-1',
      model_id: 'gpt-4o',
      type: 'regression' as const,
      severity: 'high' as const,
      message: 'Test alert',
      created_at: '2026-05-08T10:00:00Z'
    }
    saveAlert(alert)
    const retrieved = getAlert('test-1')
    expect(retrieved).toBeDefined()
    expect(retrieved?.id).toBe('test-1')
  })

  it('getAllAlerts returns sorted alerts', () => {
    saveAlert({
      id: 'a1',
      run_id: 'r1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'high',
      message: 'First',
      created_at: '2026-05-08T10:00:00Z'
    })
    saveAlert({
      id: 'a2',
      run_id: 'r2',
      model_id: 'gpt-4o',
      type: 'failure',
      severity: 'critical',
      message: 'Second',
      created_at: '2026-05-09T10:00:00Z'
    })
    const alerts = getAllAlerts()
    expect(alerts).toHaveLength(2)
    expect(alerts[0].id).toBe('a2')
  })

  it('getAlertsByModel filters correctly', () => {
    saveAlert({
      id: 'a1',
      run_id: 'r1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'high',
      message: 'First',
      created_at: '2026-05-08T10:00:00Z'
    })
    saveAlert({
      id: 'a2',
      run_id: 'r2',
      model_id: 'claude-3.5',
      type: 'failure',
      severity: 'critical',
      message: 'Second',
      created_at: '2026-05-09T10:00:00Z'
    })
    const alerts = getAlertsByModel('gpt-4o')
    expect(alerts).toHaveLength(1)
    expect(alerts[0].model_id).toBe('gpt-4o')
  })

  it('deleteAlert removes alert', () => {
    saveAlert({
      id: 'a1',
      run_id: 'r1',
      model_id: 'gpt-4o',
      type: 'regression',
      severity: 'high',
      message: 'First',
      created_at: '2026-05-08T10:00:00Z'
    })
    const deleted = deleteAlert('a1')
    expect(deleted).toBe(true)
    expect(getAlert('a1')).toBeUndefined()
  })

  it('saveSubscription and getSubscriptions work', () => {
    const sub = {
      userId: 'user-1',
      modelId: 'gpt-4o',
      alertTypes: ['regression'] as const,
      transportType: 'webhook' as const,
      webhookUrl: 'https://example.com/hook',
      enabled: true
    }
    saveSubscription(sub)
    const subs = getSubscriptions('user-1')
    expect(subs).toHaveLength(1)
    expect(subs[0].modelId).toBe('gpt-4o')
  })

  it('getSubscriptionsForModel returns matching subscriptions', () => {
    saveSubscription({
      userId: 'user-1',
      modelId: 'gpt-4o',
      alertTypes: ['regression'],
      transportType: 'webhook',
      webhookUrl: 'https://example.com/hook',
      enabled: true
    })
    saveSubscription({
      userId: 'user-2',
      modelId: '*',
      alertTypes: ['failure'],
      transportType: 'email',
      emailTo: 'admin@example.com',
      enabled: true
    })
    const subs = getSubscriptionsForModel('gpt-4o')
    expect(subs).toHaveLength(2)
  })

  it('deleteSubscription removes subscription', () => {
    saveSubscription({
      userId: 'user-1',
      modelId: 'gpt-4o',
      alertTypes: ['regression'],
      transportType: 'webhook',
      webhookUrl: 'https://example.com/hook',
      enabled: true
    })
    const deleted = deleteSubscription('user-1', 'gpt-4o', 'webhook')
    expect(deleted).toBe(true)
    expect(getSubscriptions('user-1')).toHaveLength(0)
  })
})