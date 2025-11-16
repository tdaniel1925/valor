// Error handling utility functions

/**
 * Checks if error is a known error type
 */
export function isKnownError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Gets error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isKnownError(error)) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unknown error occurred"
}

/**
 * Gets error code from error
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isKnownError(error) && "code" in error) {
    return String(error.code)
  }
  return undefined
}

/**
 * Creates a user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  const message = getErrorMessage(error)

  // Map common error messages to user-friendly ones
  const errorMap: Record<string, string> = {
    "Network request failed": "Unable to connect to the server. Please check your internet connection.",
    "Unauthorized": "You are not authorized to perform this action.",
    "Forbidden": "You don't have permission to access this resource.",
    "Not Found": "The requested resource was not found.",
    "Validation failed": "Please check your input and try again.",
    "Duplicate entry": "This record already exists.",
  }

  return errorMap[message] || message || "An unexpected error occurred. Please try again."
}

/**
 * Logs error with context
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const message = getErrorMessage(error)
  const code = getErrorCode(error)

  console.error("Error:", {
    message,
    code,
    context,
    error,
  })
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("connection") ||
    message.includes("timeout")
  )
}

/**
 * Checks if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes("validation") ||
    message.includes("invalid") ||
    message.includes("required")
  )
}

/**
 * Checks if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("authentication")
  )
}

