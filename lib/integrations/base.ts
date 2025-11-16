// Base integration interface for all third-party integrations

export interface IntegrationConfig {
  apiKey?: string
  apiUrl?: string
  [key: string]: any
}

export interface IntegrationError {
  code: string
  message: string
  details?: any
}

export abstract class BaseIntegration {
  protected config: IntegrationConfig

  constructor(config: IntegrationConfig) {
    this.config = config
  }

  abstract authenticate(): Promise<boolean>
  abstract healthCheck(): Promise<boolean>

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      throw {
        code: "INTEGRATION_ERROR",
        message: error.message,
        details: error,
      } as IntegrationError
    }
  }
}

