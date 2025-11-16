import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")

export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\(\)]+$/, "Invalid phone number format")
  .min(10, "Phone number must be at least 10 digits")

export const currencySchema = z
  .string()
  .regex(/^\$?[\d,]+(\.\d{2})?$/, "Invalid currency format")
  .transform((val) => {
    // Remove $ and commas, convert to number
    const cleaned = val.replace(/[$,]/g, "")
    return parseFloat(cleaned)
  })

export const dateSchema = z.string().or(z.date())

export const requiredStringSchema = z.string().min(1, "This field is required")

export const optionalStringSchema = z.string().optional()

// Form validation helpers
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _form: "Validation failed" } }
  }
}

