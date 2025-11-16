"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultOpen = true,
}: FormSectionProps) {
  return (
    <Card className={cn(className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

