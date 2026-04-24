import type { AggregatedMetrics } from './quality-metrics'

export function exportToCSV(metrics: AggregatedMetrics[]): string {
  const headers = ['Model', 'Runs', 'Avg Score', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Trend', 'Anomalies']
  const rows = metrics.map(m => [
    m.modelId,
    m.runCount,
    m.averageScore.toFixed(2),
    m.scoreDistribution.quartiles.min.toFixed(1),
    m.scoreDistribution.quartiles.q1.toFixed(1),
    m.scoreDistribution.quartiles.median.toFixed(1),
    m.scoreDistribution.quartiles.q3.toFixed(1),
    m.scoreDistribution.quartiles.max.toFixed(1),
    m.trend.direction,
    m.anomalies.length
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

export function exportToJSON(metrics: AggregatedMetrics[]): string {
  return JSON.stringify(metrics, null, 2)
}

export function generateReportHTML(metrics: AggregatedMetrics[]): string {
  const rows = metrics.map(m => `
    <tr>
      <td>${m.modelId}</td>
      <td>${m.runCount}</td>
      <td>${m.averageScore.toFixed(2)}</td>
      <td>${m.scoreDistribution.mean.toFixed(2)}</td>
      <td>${m.trend.direction}</td>
      <td>${m.anomalies.length}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Quality Metrics Report</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #1e293b; }
    h1 { color: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Quality Metrics Report</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>Runs</th>
        <th>Avg Score</th>
        <th>Mean</th>
        <th>Trend</th>
        <th>Anomalies</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>
  `.trim()
}