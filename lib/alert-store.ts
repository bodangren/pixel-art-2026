import { z } from 'zod'

export const alertSchema = z.object({
  id: z.string(),
  run_id: z.string(),
  model_id: z.string(),
  type: z.enum(['regression', 'failure', 'completion']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  message: z.string(),
  created_at: z.string(),
  metadata: z.any().optional()
})

export const alertSubscriptionSchema = z.object({
  userId: z.string(),
  modelId: z.string(),
  alertTypes: z.array(z.enum(['regression', 'failure', 'completion'])),
  transportType: z.enum(['webhook', 'email']),
  webhookUrl: z.string().optional(),
  emailTo: z.string().optional(),
  enabled: z.boolean()
})

export type Alert = z.infer<typeof alertSchema>
export type AlertSubscription = z.infer<typeof alertSubscriptionSchema>

const alertStore = new Map<string, Alert>()
const subscriptionStore = new Map<string, AlertSubscription[]>()

export function saveAlert(alert: Alert): Alert {
  alertStore.set(alert.id, alert)
  return alert
}

export function getAlert(id: string): Alert | undefined {
  return alertStore.get(id)
}

export function getAllAlerts(): Alert[] {
  return Array.from(alertStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getAlertsByModel(modelId: string): Alert[] {
  return Array.from(alertStore.values())
    .filter(a => a.model_id === modelId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function deleteAlert(id: string): boolean {
  return alertStore.delete(id)
}

export function saveSubscription(subscription: AlertSubscription): AlertSubscription {
  const key = subscription.userId
  const existing = subscriptionStore.get(key) || []
  const updated = existing.filter(s => !(s.modelId === subscription.modelId && s.transportType === subscription.transportType))
  updated.push(subscription)
  subscriptionStore.set(key, updated)
  return subscription
}

export function getSubscriptions(userId: string): AlertSubscription[] {
  return subscriptionStore.get(userId) || []
}

export function getSubscriptionsForModel(modelId: string): AlertSubscription[] {
  const allSubscriptions: AlertSubscription[] = []
  for (const subs of subscriptionStore.values()) {
    allSubscriptions.push(...subs)
  }
  return allSubscriptions.filter(s => s.modelId === modelId || s.modelId === '*')
}

export function deleteSubscription(userId: string, modelId: string, transportType: 'webhook' | 'email'): boolean {
  const existing = subscriptionStore.get(userId) || []
  const filtered = existing.filter(s => !(s.modelId === modelId && s.transportType === transportType))
  subscriptionStore.set(userId, filtered)
  return existing.length !== filtered.length
}

export function clearAllAlerts(): void {
  alertStore.clear()
}

export function clearAllSubscriptions(): void {
  subscriptionStore.clear()
}