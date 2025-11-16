// Extended date utility functions

import { format, addDays, addMonths, addYears, subDays, subMonths, subYears, isBefore, isAfter, isSameDay, differenceInDays, differenceInMonths, differenceInYears } from "date-fns"

/**
 * Gets start of day
 */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Gets end of day
 */
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Gets start of week
 */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return startOfDay(new Date(d.setDate(diff)))
}

/**
 * Gets end of week
 */
export function endOfWeek(date: Date = new Date()): Date {
  const d = startOfWeek(date)
  return endOfDay(addDays(d, 6))
}

/**
 * Gets start of month
 */
export function startOfMonth(date: Date = new Date()): Date {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
}

/**
 * Gets end of month
 */
export function endOfMonth(date: Date = new Date()): Date {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

/**
 * Gets start of year
 */
export function startOfYear(date: Date = new Date()): Date {
  return startOfDay(new Date(date.getFullYear(), 0, 1))
}

/**
 * Gets end of year
 */
export function endOfYear(date: Date = new Date()): Date {
  return endOfDay(new Date(date.getFullYear(), 11, 31))
}

/**
 * Checks if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Checks if date is yesterday
 */
export function isYesterday(date: Date): boolean {
  return isSameDay(date, subDays(new Date(), 1))
}

/**
 * Checks if date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  return isSameDay(date, addDays(new Date(), 1))
}

/**
 * Checks if date is in the past
 */
export function isPast(date: Date): boolean {
  return isBefore(date, new Date())
}

/**
 * Checks if date is in the future
 */
export function isFuture(date: Date): boolean {
  return isAfter(date, new Date())
}

/**
 * Gets days between two dates
 */
export function daysBetween(start: Date, end: Date): number {
  return Math.abs(differenceInDays(start, end))
}

/**
 * Gets months between two dates
 */
export function monthsBetween(start: Date, end: Date): number {
  return Math.abs(differenceInMonths(start, end))
}

/**
 * Gets years between two dates
 */
export function yearsBetween(start: Date, end: Date): number {
  return Math.abs(differenceInYears(start, end))
}

/**
 * Formats date as relative time (e.g., "2 days ago")
 */
export function formatRelative(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Formats date range
 */
export function formatDateRange(start: Date, end: Date, formatStr: string = "MMM dd, yyyy"): string {
  if (isSameDay(start, end)) {
    return format(start, formatStr)
  }
  return `${format(start, formatStr)} - ${format(end, formatStr)}`
}

/**
 * Gets age from birth date
 */
export function getAge(birthDate: Date): number {
  return yearsBetween(birthDate, new Date())
}

/**
 * Checks if date is within range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return (isAfter(date, start) || isSameDay(date, start)) &&
         (isBefore(date, end) || isSameDay(date, end))
}

/**
 * Gets business days between dates (excluding weekends)
 */
export function businessDaysBetween(start: Date, end: Date): number {
  let count = 0
  const current = new Date(start)
  
  while (current <= end) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return count
}

/**
 * Adds business days to date
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dayOfWeek = result.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++
    }
  }
  
  return result
}

