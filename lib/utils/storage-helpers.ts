// Storage utility functions (localStorage, sessionStorage)

/**
 * Safe localStorage getter
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safe localStorage setter
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
  }
}

/**
 * Safe localStorage remover
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
  }
}

/**
 * Safe sessionStorage getter
 */
export function getSessionStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = window.sessionStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safe sessionStorage setter
 */
export function setSessionStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error)
  }
}

/**
 * Clear all localStorage (with optional prefix filter)
 */
export function clearLocalStorage(prefix?: string): void {
  if (typeof window === "undefined") return

  try {
    if (prefix) {
      const keys = Object.keys(window.localStorage)
      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          window.localStorage.removeItem(key)
        }
      })
    } else {
      window.localStorage.clear()
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}

