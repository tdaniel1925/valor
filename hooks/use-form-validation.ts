"use client"

import { useState, useCallback } from "react"
import { validationRules, validateForm, type ValidationResult } from "@/lib/utils/validation-helpers"

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  rules: Record<keyof T, Array<(value: any) => string | null>>
) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = useCallback((): ValidationResult => {
    const result = validateForm(data, rules)
    setErrors(result.errors)
    return result
  }, [data, rules])

  const validateField = useCallback(
    (field: keyof T) => {
      const fieldRules = rules[field]
      if (!fieldRules) return

      const value = data[field]
      for (const rule of fieldRules) {
        const error = rule(value)
        if (error) {
          setErrors((prev) => ({ ...prev, [String(field)]: error }))
          return
        }
      }

      // Clear error if validation passes
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[String(field)]
        return newErrors
      })
    },
    [data, rules]
  )

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
    // Validate field if it's been touched
    if (touched[String(field)]) {
      setTimeout(() => validateField(field), 0)
    }
  }, [touched, validateField])

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [String(field)]: true }))
    validateField(field)
  }, [validateField])

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }, [initialData])

  const hasErrors = Object.keys(errors).length > 0
  const isValid = !hasErrors

  return {
    data,
    errors,
    touched,
    setData,
    setFieldValue,
    setFieldTouched,
    validate,
    validateField,
    reset,
    hasErrors,
    isValid,
  }
}

