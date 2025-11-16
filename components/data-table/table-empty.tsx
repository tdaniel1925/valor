"use client"

import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableEmptyProps {
  message?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function TableEmpty({
  message = "No data available",
  description,
  action,
  className,
}: TableEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

