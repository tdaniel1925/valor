// Environment variable validation and type-safe access

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
] as const

const optionalEnvVars = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "EMAIL_FROM",
  "EMAIL_SERVICE_API_KEY",
] as const

interface EnvConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  database: {
    url: string
  }
  email?: {
    from: string
    apiKey?: string
  }
}

function validateEnv(): EnvConfig {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    )
  }

  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    database: {
      url: process.env.DATABASE_URL!,
    },
    email: process.env.EMAIL_FROM
      ? {
          from: process.env.EMAIL_FROM,
          apiKey: process.env.EMAIL_SERVICE_API_KEY,
        }
      : undefined,
  }
}

// Validate on import (server-side only)
let envConfig: EnvConfig | null = null

if (typeof window === "undefined") {
  try {
    envConfig = validateEnv()
  } catch (error) {
    console.error("Environment validation failed:", error)
    // Don't throw in development to allow for gradual setup
    if (process.env.NODE_ENV === "production") {
      throw error
    }
  }
}

export function getEnv(): EnvConfig {
  if (!envConfig) {
    envConfig = validateEnv()
  }
  return envConfig
}

// Type-safe environment variable accessors
export const env = {
  get supabase() {
    return getEnv().supabase
  },
  get database() {
    return getEnv().database
  },
  get email() {
    return getEnv().email
  },
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
}

