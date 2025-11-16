// Rate limiting utility
// Simple in-memory rate limiter (for production, use Redis or similar)

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  // Clean up expired entries
  if (store[key] && store[key].resetTime < now) {
    delete store[key]
  }

  // Initialize or get existing entry
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + options.windowMs,
    }
  }

  const entry = store[key]

  // Check if limit exceeded
  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count++

  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

// Helper for API routes
export function getRateLimitIdentifier(request: Request): string {
  // Try to get IP address from headers
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0] || realIp || "unknown"

  // You can also use user ID if authenticated
  // const userId = getUserId(request)
  // return userId || ip

  return ip
}

// Rate limit presets
export const rateLimitPresets = {
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  },
  moderate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  lenient: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
  },
}

