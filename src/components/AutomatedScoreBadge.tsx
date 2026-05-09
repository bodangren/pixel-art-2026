import React from 'react'

interface AutomatedScoreBadgeProps {
  score: number
  confidence: 'high' | 'medium' | 'low'
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const AutomatedScoreBadge: React.FC<AutomatedScoreBadgeProps> = ({
  score,
  confidence,
  size = 'sm',
  showLabel = true
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
  const scoreClasses = score < 40
    ? 'bg-red-500/20 text-red-400'
    : score < 70
    ? 'bg-yellow-500/20 text-yellow-400'
    : 'bg-green-500/20 text-green-400'

  const confidenceDot = confidence === 'high' ? 'text-green-400' : confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'

  return (
    <span
      className={`${sizeClasses} ${scoreClasses} rounded font-mono uppercase tracking-tighter inline-flex items-center gap-1`}
      title={`Automated quality score: ${score}/100 (${confidence} confidence)`}
    >
      {showLabel && <span>Auto:</span>}
      <span>{score.toFixed(1)}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${confidenceDot}`} />
    </span>
  )
}

export default AutomatedScoreBadge