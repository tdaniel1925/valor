"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface FormActionsProps {
  onCancel?: () => void
  onSubmit?: () => void
  cancelLabel?: string
  submitLabel?: string
  loading?: boolean
  disabled?: boolean
  className?: string
  showCancel?: boolean
}

export function FormActions({
  onCancel,
  onSubmit,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  loading = false,
  disabled = false,
  showCancel = true,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      {showCancel && onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || disabled}
        >
          {cancelLabel}
        </Button>
      )}
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={loading || disabled}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      )}
    </div>
  )
}

