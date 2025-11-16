// Async utility functions

/**
 * Wraps an async function to handle errors gracefully
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    return { data: fallback || null, error: err }
  }
}

/**
 * Retries an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    backoffFactor?: number
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffFactor, attempt),
          maxDelay
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Retry failed")
}

/**
 * Debounces an async function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null
  let pending: Promise<ReturnType<T>> | null = null

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(async () => {
        timeout = null
        try {
          const result = await fn(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, wait)
    })
  }
}

/**
 * Timeout wrapper for async functions
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
    ),
  ])
}

