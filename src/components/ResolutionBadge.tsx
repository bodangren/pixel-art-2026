import React from 'react'

interface ResolutionBadgeProps {
  resolution: string
  size?: 'sm' | 'md'
}

const ResolutionBadge: React.FC<ResolutionBadgeProps> = ({ resolution, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
  
  return (
    <span className={`${sizeClasses} bg-blue-500/20 text-blue-400 rounded font-mono uppercase tracking-tighter`}>
      {resolution}
    </span>
  )
}

export default ResolutionBadge