import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Table header skeleton */}
        <div className="flex gap-4 border-b pb-2">
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>

        {/* Table rows skeleton */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-2">
            {[...Array(columns)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}

