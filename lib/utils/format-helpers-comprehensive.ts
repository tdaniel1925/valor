// Comprehensive formatting helper functions

/**
 * Formats currency with symbol
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "USD",
  locale: string = "en-US",
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return "$0.00"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numAmount)
}

/**
 * Formats number with thousand separators
 */
export function formatNumber(
  value: number | string,
  decimals: number = 0,
  locale: string = "en-US"
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(numValue)) return "0"

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue)
}

/**
 * Formats percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  showSign: boolean = false
): string {
  if (isNaN(value)) return "0%"
  const formatted = value.toFixed(decimals)
  const sign = showSign && value > 0 ? "+" : ""
  return `${sign}${formatted}%`
}

/**
 * Formats file size
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`
}

/**
 * Formats duration in milliseconds
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Formats relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = typeof date === "string" ? new Date(date) : date
  const diffMs = now.getTime() - then.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`
}

/**
 * Formats date in short format
 */
export function formatDateShort(date: Date | string, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Formats date and time
 */
export function formatDateTime(date: Date | string, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * Formats time only
 */
export function formatTime(date: Date | string, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * Formats initials from name
 */
export function formatInitials(name: string, maxInitials: number = 2): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0][0].toUpperCase()
  if (maxInitials === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Formats phone number (US format)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

/**
 * Formats SSN
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, "")
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`
  }
  return ssn
}

/**
 * Formats ZIP code
 */
export function formatZipCode(zip: string): string {
  const cleaned = zip.replace(/\D/g, "")
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  }
  if (cleaned.length === 5) {
    return cleaned
  }
  return zip
}

/**
 * Formats credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "")
  if (cleaned.length === 16) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)} ${cleaned.slice(12)}`
  }
  return cardNumber
}

/**
 * Formats case number with prefix
 */
export function formatCaseNumber(number: string | number, prefix: string = "CASE"): string {
  const num = typeof number === "string" ? number : String(number).padStart(6, "0")
  return `${prefix}-${num}`
}

/**
 * Formats quote number with prefix
 */
export function formatQuoteNumber(number: string | number, prefix: string = "QUOTE"): string {
  const num = typeof number === "string" ? number : String(number).padStart(6, "0")
  return `${prefix}-${num}`
}

