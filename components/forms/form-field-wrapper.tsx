"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { InfoTooltip } from "@/components/info/info-tooltip"

interface FormFieldWrapperProps {
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  labelClassName?: string
  tooltip?: string
}

export function FormFieldWrapper({
  label,
  description,
  error,
  required,
  children,
  className,
  labelClassName,
  tooltip,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <Label className={cn(labelClassName)}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

