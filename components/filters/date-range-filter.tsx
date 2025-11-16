"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface DateRangeFilterProps {
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  className?: string
}

export function DateRangeFilter({ onDateRangeChange, className }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    onDateRangeChange({
      from: range?.from,
      to: range?.to,
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label>Date Range</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {(dateRange.from || dateRange.to) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const cleared = { from: undefined, to: undefined }
            setDateRange(cleared)
            onDateRangeChange(cleared)
          }}
        >
          Clear
        </Button>
      )}
    </div>
  )
}

