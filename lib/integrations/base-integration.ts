// Base integration service with retry logic and error handling

interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
}

export abstract class BaseIntegrationService {
  protected baseUrl: string
  protected apiKey: string
  protected timeout: number

  constructor(baseUrl: string, apiKey: string, timeout: number = 30000) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
    this.timeout = timeout
  }

  /**
   * Makes HTTP request with retry logic
   */
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOptions: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      exponentialBackoff = true,
    } = retryOptions

    const url = `${this.baseUrl}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            ...options.headers,
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `API request failed: ${response.status} ${response.statusText} - ${errorText}`
          )
        }

        return await response.json()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on abort or if it's the last attempt
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Request timeout")
        }

        if (attempt < maxRetries) {
          const delay = exponentialBackoff
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        throw lastError
      }
    }

    throw lastError || new Error("Request failed")
  }

  /**
   * Handles API errors consistently
   */
  protected handleError(error: unknown, context?: string): never {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred"
    const errorMessage = context ? `${context}: ${message}` : message

    console.error("Integration error:", errorMessage, error)
    throw new Error(errorMessage)
  }

  /**
   * Validates API response
   */
  protected validateResponse<T>(
    response: any,
    schema?: (data: any) => data is T
  ): T {
    if (!response) {
      throw new Error("Empty response from API")
    }

    if (schema && !schema(response)) {
      throw new Error("Invalid response format")
    }

    return response as T
  }
}

