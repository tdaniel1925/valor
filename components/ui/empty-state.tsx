import { ReactNode } from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
}

export function EmptyState({
  title = "No items found",
  description = "Get started by creating your first item.",
  action,
  icon,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground max-w-md">{description}</p>
        {action && (
          <Button onClick={action.onClick} variant="default">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

