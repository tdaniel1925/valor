// Number utility functions

/**
 * Formats a number with commas
 */
export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num
  if (isNaN(n)) return "0"
  return n.toLocaleString("en-US")
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "USD"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return "$0.00"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(
  value: number | string,
  decimals: number = 1
): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0%"
  return `${num.toFixed(decimals)}%`
}

/**
 * Rounds a number to specified decimal places
 */
export function roundTo(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

/**
 * Clamps a number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * Checks if a number is within a range
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max
}

/**
 * Calculates percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}

/**
 * Formats file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${roundTo(bytes / Math.pow(k, i), 2)} ${sizes[i]}`
}

