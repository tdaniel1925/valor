"use client"

import { cn } from "@/lib/utils"
import { getStatusColor } from "@/lib/utils/color-helpers"

interface StatusIndicatorProps {
  status: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function StatusIndicator({
  status,
  size = "md",
  showLabel = false,
  className,
}: StatusIndicatorProps) {
  const color = getStatusColor(status)

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("rounded-full", sizeClasses[size])}
        style={{ backgroundColor: color }}
      />
      {showLabel && (
        <span className="text-sm font-medium capitalize">{status}</span>
      )}
    </div>
  )
}

