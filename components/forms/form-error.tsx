"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface FormErrorProps {
  error?: string | null
  className?: string
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null

  return (
    <Alert variant="destructive" className={cn(className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

