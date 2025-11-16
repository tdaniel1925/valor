// Date range utility functions

import { format, startOfDay, endOfDay, subDays, subMonths, subYears } from "date-fns"

/**
 * Gets today's date range
 */
export function getTodayRange(): { start: Date; end: Date } {
  const today = new Date()
  return {
    start: startOfDay(today),
    end: endOfDay(today),
  }
}

/**
 * Gets yesterday's date range
 */
export function getYesterdayRange(): { start: Date; end: Date } {
  const yesterday = subDays(new Date(), 1)
  return {
    start: startOfDay(yesterday),
    end: endOfDay(yesterday),
  }
}

/**
 * Gets this week's date range
 */
export function getThisWeekRange(): { start: Date; end: Date } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const start = subDays(today, dayOfWeek)
  const end = new Date()
  return {
    start: startOfDay(start),
    end: endOfDay(end),
  }
}

/**
 * Gets last week's date range
 */
export function getLastWeekRange(): { start: Date; end: Date } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const end = subDays(today, dayOfWeek + 1)
  const start = subDays(end, 6)
  return {
    start: startOfDay(start),
    end: endOfDay(end),
  }
}

/**
 * Gets this month's date range
 */
export function getThisMonthRange(): { start: Date; end: Date } {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  return {
    start: startOfDay(start),
    end: endOfDay(today),
  }
}

/**
 * Gets last month's date range
 */
export function getLastMonthRange(): { start: Date; end: Date } {
  const today = new Date()
  const lastMonth = subMonths(today, 1)
  const start = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
  const end = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
  return {
    start: startOfDay(start),
    end: endOfDay(end),
  }
}

/**
 * Gets this quarter's date range
 */
export function getThisQuarterRange(): { start: Date; end: Date } {
  const today = new Date()
  const quarter = Math.floor(today.getMonth() / 3)
  const start = new Date(today.getFullYear(), quarter * 3, 1)
  return {
    start: startOfDay(start),
    end: endOfDay(today),
  }
}

/**
 * Gets last quarter's date range
 */
export function getLastQuarterRange(): { start: Date; end: Date } {
  const today = new Date()
  const quarter = Math.floor(today.getMonth() / 3)
  const lastQuarter = quarter === 0 ? 3 : quarter - 1
  const year = quarter === 0 ? today.getFullYear() - 1 : today.getFullYear()
  const start = new Date(year, lastQuarter * 3, 1)
  const end = new Date(year, (lastQuarter + 1) * 3, 0)
  return {
    start: startOfDay(start),
    end: endOfDay(end),
  }
}

/**
 * Gets this year's date range
 */
export function getThisYearRange(): { start: Date; end: Date } {
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 1)
  return {
    start: startOfDay(start),
    end: endOfDay(today),
  }
}

/**
 * Gets last year's date range
 */
export function getLastYearRange(): { start: Date; end: Date } {
  const today = new Date()
  const lastYear = subYears(today, 1)
  const start = new Date(lastYear.getFullYear(), 0, 1)
  const end = new Date(lastYear.getFullYear(), 11, 31)
  return {
    start: startOfDay(start),
    end: endOfDay(end),
  }
}

/**
 * Gets last N days range
 */
export function getLastNDaysRange(days: number): { start: Date; end: Date } {
  const today = new Date()
  const start = subDays(today, days)
  return {
    start: startOfDay(start),
    end: endOfDay(today),
  }
}

/**
 * Formats date range for display
 */
export function formatDateRange(
  start: Date,
  end: Date,
  formatStr: string = "MMM dd, yyyy"
): string {
  return `${format(start, formatStr)} - ${format(end, formatStr)}`
}

