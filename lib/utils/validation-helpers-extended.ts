// Extended validation helper functions

import { z } from "zod"

/**
 * Validates email format
 */
export const emailSchema = z.string().email("Invalid email address")

/**
 * Validates phone number (US format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Invalid phone number")

/**
 * Validates URL
 */
export const urlSchema = z.string().url("Invalid URL")

/**
 * Validates date string
 */
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")

/**
 * Validates currency amount
 */
export const currencySchema = z
  .string()
  .regex(/^\$?\d+(\.\d{2})?$/, "Invalid currency format")
  .or(z.number().positive("Amount must be positive"))

/**
 * Validates percentage (0-100)
 */
export const percentageSchema = z
  .number()
  .min(0, "Percentage must be at least 0")
  .max(100, "Percentage must be at most 100")

/**
 * Validates case status
 */
export const caseStatusSchema = z.enum([
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "pending_requirements",
  "issued",
])

/**
 * Validates quote type
 */
export const quoteTypeSchema = z.enum(["life", "term", "annuity"])

/**
 * Validates commission status
 */
export const commissionStatusSchema = z.enum(["pending", "paid", "cancelled"])

/**
 * Validates UUID
 */
export const uuidSchema = z.string().uuid("Invalid UUID format")

/**
 * Validates non-empty string
 */
export const nonEmptyStringSchema = z
  .string()
  .min(1, "This field is required")
  .trim()

/**
 * Validates optional non-empty string
 */
export const optionalStringSchema = z
  .string()
  .optional()
  .refine((val) => !val || val.trim().length > 0, "String cannot be only whitespace")

/**
 * Validates positive number
 */
export const positiveNumberSchema = z
  .number()
  .positive("Must be a positive number")

/**
 * Validates non-negative number
 */
export const nonNegativeNumberSchema = z
  .number()
  .min(0, "Must be a non-negative number")

/**
 * Validates integer
 */
export const integerSchema = z.number().int("Must be an integer")

/**
 * Validates date range
 */
export function dateRangeSchema(startDate: Date, endDate: Date) {
  return z.object({
    start: z.date().min(startDate, "Start date is too early"),
    end: z.date().max(endDate, "End date is too late"),
  }).refine((data) => data.start <= data.end, {
    message: "Start date must be before end date",
    path: ["end"],
  })
}

/**
 * Validates file size (in bytes)
 */
export function maxFileSizeSchema(maxSizeBytes: number) {
  return z.instanceof(File).refine(
    (file) => file.size <= maxSizeBytes,
    `File size must be less than ${maxSizeBytes} bytes`
  )
}

/**
 * Validates file type
 */
export function fileTypeSchema(allowedTypes: string[]) {
  return z.instanceof(File).refine(
    (file) => allowedTypes.includes(file.type),
    `File type must be one of: ${allowedTypes.join(", ")}`
  )
}

