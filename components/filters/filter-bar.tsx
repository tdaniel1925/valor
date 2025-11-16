"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  filters: {
    [key: string]: {
      label: string
      options: FilterOption[]
      value?: string
      onChange: (value: string) => void
    }
  }
  onClear?: () => void
}

export function FilterBar({ filters, onClear }: FilterBarProps) {
  const hasActiveFilters = Object.values(filters).some((f) => f.value)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(filters).map(([key, filter]) => (
        <div key={key} className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            {filter.label}:
          </label>
          <Select value={filter.value || ""} onValueChange={filter.onChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`All ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      {hasActiveFilters && onClear && (
        <Button variant="outline" size="sm" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}

