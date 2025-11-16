"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface DataGridProps<T> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T, index: number) => string | number
  columns?: 1 | 2 | 3 | 4
  className?: string
  emptyMessage?: string
}

export function DataGrid<T>({
  data,
  renderItem,
  keyExtractor,
  columns = 3,
  className,
  emptyMessage = "No items found",
}: DataGridProps<T>) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {data.map((item, index) => (
        <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
      ))}
    </div>
  )
}

