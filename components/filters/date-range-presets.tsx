"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "lucide-react"
import {
  getTodayRange,
  getYesterdayRange,
  getThisWeekRange,
  getLastWeekRange,
  getThisMonthRange,
  getLastMonthRange,
  getThisQuarterRange,
  getLastQuarterRange,
  getThisYearRange,
  getLastYearRange,
  getLastNDaysRange,
  formatDateRange,
} from "@/lib/utils/date-range-helpers"

interface DateRangePresetsProps {
  onRangeSelect: (range: { start: Date; end: Date }) => void
  className?: string
}

const presets = [
  { label: "Today", getRange: getTodayRange },
  { label: "Yesterday", getRange: getYesterdayRange },
  { label: "This Week", getRange: getThisWeekRange },
  { label: "Last Week", getRange: getLastWeekRange },
  { label: "This Month", getRange: getThisMonthRange },
  { label: "Last Month", getRange: getLastMonthRange },
  { label: "This Quarter", getRange: getThisQuarterRange },
  { label: "Last Quarter", getRange: getLastQuarterRange },
  { label: "This Year", getRange: getThisYearRange },
  { label: "Last Year", getRange: getLastYearRange },
  { label: "Last 7 Days", getRange: () => getLastNDaysRange(7) },
  { label: "Last 30 Days", getRange: () => getLastNDaysRange(30) },
  { label: "Last 90 Days", getRange: () => getLastNDaysRange(90) },
]

export function DateRangePresets({
  onRangeSelect,
  className,
}: DateRangePresetsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Calendar className="mr-2 h-4 w-4" />
          Quick Select
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Date Presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.label}
            onClick={() => {
              const range = preset.getRange()
              onRangeSelect(range)
            }}
          >
            {preset.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

