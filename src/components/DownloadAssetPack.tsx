'use client'

import { useState } from 'react'
import JSZip from 'jszip'

interface DownloadAssetPackProps {
  runId: string
  modelId: string
  assetPaths: string[]
  humanScore?: number
  techScore?: number
}

export default function DownloadAssetPack({
  runId,
  modelId,
  assetPaths,
  humanScore,
  techScore
}: DownloadAssetPackProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const manifest = `# Asset Pack: ${modelId} - ${runId.split('__')[1] || 'unknown'}
Model: ${modelId}
Run ID: ${runId}
Generated: ${new Date().toISOString()}
Human Score: ${humanScore?.toFixed(1) ?? 'N/A'}
Technical Score: ${techScore?.toFixed(1) ?? 'N/A'}

## Contents
${assetPaths.map(p => `- ${p.split('/').pop()}`).join('\n')}

## License
CC-BY 4.0 - Free to use with attribution to the benchmark project.
`

  const handleDownload = async () => {
    if (assetPaths.length === 0) return
    setIsGenerating(true)

    try {
      const zip = new JSZip()
      zip.file('README.txt', manifest)

      const folder = zip.folder('assets')
      if (!folder) throw new Error('Failed to create assets folder')

      const basePath = `/data/runs/${runId}/assets/`

      const fetchPromises = assetPaths.map(async (assetPath) => {
        const filename = assetPath.split('/').pop() || 'asset.png'
        try {
          const response = await fetch(basePath + filename)
          if (response.ok) {
            const blob = await response.blob()
            folder.file(filename, blob)
          }
        } catch {
          // Skip failed assets
        }
      })

      await Promise.all(fetchPromises)

      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${modelId.toLowerCase().replace(/\s+/g, '-')}-${runId.split('__')[1] || 'assets'}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsGenerating(false)
    }
  }

  const hasAssets = assetPaths.length > 0

  return (
    <button
      onClick={handleDownload}
      disabled={!hasAssets || isGenerating}
      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
        hasAssets && !isGenerating
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
      }`}
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating ZIP...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Asset Pack ({assetPaths.length} files)
        </span>
      )}
    </button>
  )
}