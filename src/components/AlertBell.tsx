'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AlertSummary {
  total: number
  critical: number
  high: number
}

export function AlertBell({ alertCount = 0, criticalCount = 0 }: AlertSummary) {
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    setHasNew(alertCount > 0)
  }, [alertCount])

  return (
    <Link
      href="/alerts"
      className="relative flex items-center justify-center w-8 h-8"
      aria-label={`Alerts: ${alertCount} unread`}
    >
      <svg
        className={`w-4 h-4 transition-colors ${
          hasNew ? 'text-[#C5A059]' : 'text-[#333333]'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {alertCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-black rounded-full ${
            criticalCount > 0
              ? 'bg-red-500 text-white'
              : 'bg-[#C5A059] text-black'
          }`}
        >
          {alertCount > 99 ? '99+' : alertCount}
        </span>
      )}
    </Link>
  )
}