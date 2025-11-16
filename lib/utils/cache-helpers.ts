// Cache utility functions

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Simple in-memory cache with TTL
 */
class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, value: T, ttlMs: number = 60000): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new SimpleCache()

// Cleanup expired entries every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000)
}

/**
 * Cache helper with async function
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = 60000
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const value = await fn()
  cache.set(key, value, ttlMs)
  return value
}

