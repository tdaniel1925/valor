"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ErrorDisplayProps {
  title?: string
  message: string
  onDismiss?: () => void
  dismissible?: boolean
  variant?: "default" | "destructive"
}

export function ErrorDisplay({
  title = "Error",
  message,
  onDismiss,
  dismissible = true,
  variant = "destructive",
}: ErrorDisplayProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <Alert variant={variant}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDismiss}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

