// Validation helper functions

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")
  // Check if it's 10 digits (US phone number)
  return cleaned.length === 10
}

export function validateRequired(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export function validateMinLength(value: string, min: number): boolean {
  return value.length >= min
}

export function validateMaxLength(value: string, max: number): boolean {
  return value.length <= max
}

export function validateNumber(value: string | number, min?: number, max?: number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return false
  if (min !== undefined && num < min) return false
  if (max !== undefined && num > max) return false
  return true
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateDate(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return !isNaN(dateObj.getTime())
}

export function validateDateRange(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate
  const end = typeof endDate === "string" ? new Date(endDate) : endDate
  return start <= end
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, Array<(value: any) => string | null>>
): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field as keyof T]
    
    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        errors[field] = error
        break // Stop at first error for this field
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Common validation rules
export const validationRules = {
  required: (message = "This field is required") => (value: any) => {
    return validateRequired(value) ? null : message
  },
  email: (message = "Invalid email address") => (value: string) => {
    return validateEmail(value) ? null : message
  },
  phone: (message = "Invalid phone number") => (value: string) => {
    return validatePhone(value) ? null : message
  },
  minLength: (min: number, message?: string) => (value: string) => {
    const msg = message || `Must be at least ${min} characters`
    return validateMinLength(value, min) ? null : msg
  },
  maxLength: (max: number, message?: string) => (value: string) => {
    const msg = message || `Must be no more than ${max} characters`
    return validateMaxLength(value, max) ? null : msg
  },
  number: (min?: number, max?: number, message?: string) => (value: string | number) => {
    const msg = message || "Invalid number"
    return validateNumber(value, min, max) ? null : msg
  },
  url: (message = "Invalid URL") => (value: string) => {
    return validateUrl(value) ? null : message
  },
  date: (message = "Invalid date") => (value: string | Date) => {
    return validateDate(value) ? null : message
  },
}

