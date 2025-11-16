// Date utility functions

export function getStartOfPeriod(period: "day" | "week" | "month" | "quarter" | "year"): Date {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  switch (period) {
    case "day":
      return new Date(year, month, day, 0, 0, 0, 0)
    case "week":
      const dayOfWeek = now.getDay()
      const diff = now.getDate() - dayOfWeek
      return new Date(year, month, diff, 0, 0, 0, 0)
    case "month":
      return new Date(year, month, 1, 0, 0, 0, 0)
    case "quarter":
      const quarterStartMonth = Math.floor(month / 3) * 3
      return new Date(year, quarterStartMonth, 1, 0, 0, 0, 0)
    case "year":
      return new Date(year, 0, 1, 0, 0, 0, 0)
    default:
      return now
  }
}

export function getEndOfPeriod(period: "day" | "week" | "month" | "quarter" | "year"): Date {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  switch (period) {
    case "day":
      return new Date(year, month, day, 23, 59, 59, 999)
    case "week":
      const dayOfWeek = now.getDay()
      const diff = 6 - dayOfWeek
      return new Date(year, month, day + diff, 23, 59, 59, 999)
    case "month":
      return new Date(year, month + 1, 0, 23, 59, 59, 999)
    case "quarter":
      const quarterStartMonth = Math.floor(month / 3) * 3
      return new Date(year, quarterStartMonth + 3, 0, 23, 59, 59, 999)
    case "year":
      return new Date(year, 11, 31, 23, 59, 59, 999)
    default:
      return now
  }
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  
  return formatDate(dateObj)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const weekStart = getStartOfPeriod("week")
  return dateObj >= weekStart
}

export function isThisMonth(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const monthStart = getStartOfPeriod("month")
  return dateObj >= monthStart
}

