"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusOption {
  value: string
  label: string
  color?: string
}

interface StatusFilterProps {
  options: StatusOption[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  label?: string
  className?: string
}

export function StatusFilter({
  options,
  selected,
  onSelectionChange,
  label = "Status",
  className,
}: StatusFilterProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((s) => s !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(options.map((o) => o.value))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selected.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>
          <button
            onClick={handleSelectAll}
            className="text-sm font-medium hover:underline"
          >
            {selected.length === options.length ? "Deselect All" : "Select All"}
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
          >
            <div className="flex items-center gap-2">
              {selected.includes(option.value) && (
                <Check className="h-4 w-4" />
              )}
              {option.color && (
                <div
                  className={cn("h-2 w-2 rounded-full", option.color)}
                  style={{ backgroundColor: option.color }}
                />
              )}
              {option.label}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

