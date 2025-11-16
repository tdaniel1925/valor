"use client"

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TableHeaderProps {
  children: React.ReactNode
  sortable?: boolean
  sortDirection?: "asc" | "desc" | null
  onSort?: () => void
  className?: string
}

export function TableHeader({
  children,
  sortable = false,
  sortDirection,
  onSort,
  className,
}: TableHeaderProps) {
  if (!sortable) {
    return <th className={className}>{children}</th>
  }

  return (
    <th className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={onSort}
      >
        <span>{children}</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
        {sortDirection && (
          <span className="ml-1">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </Button>
    </th>
  )
}

