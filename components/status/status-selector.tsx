"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getStatusColor } from "@/lib/utils/color-helpers"

interface StatusOption {
  value: string
  label: string
  color?: string
}

interface StatusSelectorProps {
  value: string
  options: StatusOption[]
  onValueChange: (value: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function StatusSelector({
  value,
  options,
  onValueChange,
  className,
  size = "md",
}: StatusSelectorProps) {
  const selectedOption = options.find((opt) => opt.value === value)
  const statusColor = selectedOption?.color || getStatusColor(value)

  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start", sizeClasses[size], className)}
        >
          {selectedOption && (
            <div
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
          )}
          {selectedOption?.label || "Select status"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {options.map((option) => {
          const optionColor = option.color || getStatusColor(option.value)
          const isSelected = value === option.value

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onValueChange(option.value)}
              className="flex items-center gap-2"
            >
              {isSelected && <Check className="h-4 w-4" />}
              {!isSelected && <div className="h-4 w-4" />}
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: optionColor }}
              />
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

