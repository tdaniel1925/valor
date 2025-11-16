import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function CaseListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

