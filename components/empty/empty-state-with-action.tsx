import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"

interface EmptyStateWithActionProps {
  title?: string
  description?: string
  icon?: ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyStateWithAction({
  title = "No items found",
  description = "Get started by creating your first item.",
  icon,
  primaryAction,
  secondaryAction,
}: EmptyStateWithActionProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-md">{description}</p>
        <div className="flex gap-3">
          {primaryAction && (
            <Button onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

