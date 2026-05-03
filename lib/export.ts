export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (val: unknown): string => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  const headerLine = headers.join(',')
  const dataLines = rows.map(row =>
    headers.map(h => escape(row[h])).join(',')
  )
  return [headerLine, ...dataLines].join('\n')
}

export function toJsonExport<T>(data: T, metadata?: { timestamp?: string; source?: string }): string {
  const payload = {
    ...metadata,
    timestamp: metadata?.timestamp ?? new Date().toISOString(),
    data
  }
  return JSON.stringify(payload, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}