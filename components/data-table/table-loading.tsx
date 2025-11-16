"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TableLoadingProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableLoading({
  rows = 5,
  columns = 5,
  className,
}: TableLoadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-10 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

