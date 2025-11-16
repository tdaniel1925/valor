// Notification utility functions

import { showSuccess, showError, showWarning, showInfo } from "./toast-helpers"

/**
 * Shows success notification
 */
export function notifySuccess(message: string): void {
  showSuccess(message)
}

/**
 * Shows error notification
 */
export function notifyError(message: string, error?: Error): void {
  const errorMessage = error ? `${message}: ${error.message}` : message
  showError(errorMessage)
}

/**
 * Shows warning notification
 */
export function notifyWarning(message: string): void {
  showWarning(message)
}

/**
 * Shows info notification
 */
export function notifyInfo(message: string): void {
  showInfo(message)
}

/**
 * Shows notification based on result
 */
export function notifyResult<T>(
  result: { success: boolean; message: string; data?: T },
  onSuccess?: (data?: T) => void
): void {
  if (result.success) {
    notifySuccess(result.message)
    onSuccess?.(result.data)
  } else {
    notifyError(result.message)
  }
}

/**
 * Shows async operation notification
 */
export async function notifyAsync<T>(
  operation: () => Promise<T>,
  options: {
    loadingMessage?: string
    successMessage?: string
    errorMessage?: string
  } = {}
): Promise<T | null> {
  const {
    loadingMessage = "Processing...",
    successMessage = "Operation completed successfully",
    errorMessage = "Operation failed",
  } = options

  try {
    notifyInfo(loadingMessage)
    const result = await operation()
    notifySuccess(successMessage)
    return result
  } catch (error) {
    notifyError(errorMessage, error instanceof Error ? error : undefined)
    return null
  }
}

