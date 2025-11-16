"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type ViewMode = "table" | "grid" | "list"

interface TableViewOptionsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function TableViewOptions({
  viewMode,
  onViewModeChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: TableViewOptionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 border rounded-md">
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("table")}
          className="h-8"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="h-8"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
      {onPageSizeChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {pageSize || 20} per page
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Items per page</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pageSizeOptions.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => onPageSizeChange(size)}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

