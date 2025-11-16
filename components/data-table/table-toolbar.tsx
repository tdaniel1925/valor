"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TableToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  actions?: React.ReactNode
  selectedCount?: number
  onClearSelection?: () => void
  className?: string
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  actions,
  selectedCount = 0,
  onClearSelection,
  className,
}: TableToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex flex-1 items-center gap-2">
        {onSearchChange && (
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            {onClearSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

