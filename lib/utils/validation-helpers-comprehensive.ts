// Comprehensive validation helper functions

import { z } from "zod"

/**
 * Validates required field
 */
export function required(message: string = "This field is required") {
  return z.string().min(1, message)
}

/**
 * Validates optional field
 */
export function optional() {
  return z.string().optional()
}

/**
 * Validates email format
 */
export function email(message: string = "Invalid email address") {
  return z.string().email(message)
}

/**
 * Validates minimum length
 */
export function minLength(length: number, message?: string) {
  return z.string().min(length, message || `Must be at least ${length} characters`)
}

/**
 * Validates maximum length
 */
export function maxLength(length: number, message?: string) {
  return z.string().max(length, message || `Must be at most ${length} characters`)
}

/**
 * Validates phone number
 */
export function phone(message: string = "Invalid phone number") {
  return z.string().regex(/^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, message)
}

/**
 * Validates URL
 */
export function url(message: string = "Invalid URL") {
  return z.string().url(message)
}

/**
 * Validates positive number
 */
export function positiveNumber(message: string = "Must be a positive number") {
  return z.number().positive(message)
}

/**
 * Validates non-negative number
 */
export function nonNegativeNumber(message: string = "Must be a non-negative number") {
  return z.number().min(0, message)
}

/**
 * Validates number range
 */
export function numberRange(min: number, max: number, message?: string) {
  return z.number().min(min, message || `Must be at least ${min}`).max(max, message || `Must be at most ${max}`)
}

/**
 * Validates date
 */
export function date(message: string = "Invalid date") {
  return z.date({ invalid_type_error: message })
}

/**
 * Validates date in the past
 */
export function pastDate(message: string = "Date must be in the past") {
  return z.date().refine((date) => date < new Date(), { message })
}

/**
 * Validates date in the future
 */
export function futureDate(message: string = "Date must be in the future") {
  return z.date().refine((date) => date > new Date(), { message })
}

/**
 * Validates date range
 */
export function dateRange(startDate: Date, endDate: Date, message?: string) {
  return z.object({
    start: z.date().min(startDate, message || "Start date is too early"),
    end: z.date().max(endDate, message || "End date is too late"),
  }).refine((data) => data.start <= data.end, {
    message: message || "Start date must be before end date",
    path: ["end"],
  })
}

/**
 * Validates enum value
 */
export function enumValue<T extends [string, ...string[]]>(values: T, message?: string) {
  return z.enum(values, { errorMap: () => ({ message: message || `Must be one of: ${values.join(", ")}` }) })
}

/**
 * Validates UUID
 */
export function uuid(message: string = "Invalid UUID format") {
  return z.string().uuid(message)
}

/**
 * Validates credit card number (simple Luhn check)
 */
export function creditCard(message: string = "Invalid credit card number") {
  return z.string().refine((value) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length < 13 || cleaned.length > 19) return false
    
    let sum = 0
    let isEven = false
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }, { message })
}

/**
 * Validates SSN format
 */
export function ssn(message: string = "Invalid SSN format") {
  return z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, message)
}

/**
 * Validates ZIP code
 */
export function zipCode(message: string = "Invalid ZIP code") {
  return z.string().regex(/^\d{5}(-\d{4})?$/, message)
}

/**
 * Validates password strength
 */
export function passwordStrength(
  minLength: number = 8,
  requireUppercase: boolean = true,
  requireLowercase: boolean = true,
  requireNumber: boolean = true,
  requireSpecial: boolean = true
) {
  return z.string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .refine((value) => !requireUppercase || /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => !requireLowercase || /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => !requireNumber || /\d/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => !requireSpecial || /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character",
    })
}

/**
 * Validates file size
 */
export function fileSize(maxSizeBytes: number, message?: string) {
  return z.instanceof(File).refine(
    (file) => file.size <= maxSizeBytes,
    { message: message || `File size must be less than ${maxSizeBytes} bytes` }
  )
}

/**
 * Validates file type
 */
export function fileType(allowedTypes: string[], message?: string) {
  return z.instanceof(File).refine(
    (file) => allowedTypes.includes(file.type),
    { message: message || `File type must be one of: ${allowedTypes.join(", ")}` }
  )
}

