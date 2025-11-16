// Utility functions for formatting data

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "$0.00"
  
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return "$0.00"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return "—"

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj)
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—"
  
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return "—"

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(dateObj)
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—"
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

