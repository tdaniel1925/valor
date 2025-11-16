// URL utility functions

/**
 * Builds query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)))
      } else {
        searchParams.set(key, String(value))
      }
    }
  }

  return searchParams.toString()
}

/**
 * Parses query string to object
 */
export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string | string[]> = {}

  for (const [key, value] of params.entries()) {
    if (result[key]) {
      // Multiple values for same key
      const existing = result[key]
      result[key] = Array.isArray(existing)
        ? [...existing, value]
        : [existing, value]
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Updates URL query parameters without page reload
 */
export function updateQueryParams(
  params: Record<string, any>,
  options: { replace?: boolean } = {}
) {
  const url = new URL(window.location.href)
  
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  if (options.replace) {
    window.history.replaceState({}, "", url.toString())
  } else {
    window.history.pushState({}, "", url.toString())
  }
}

/**
 * Gets query parameter value
 */
export function getQueryParam(key: string): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

/**
 * Removes query parameters
 */
export function removeQueryParams(keys: string[]) {
  const url = new URL(window.location.href)
  keys.forEach((key) => url.searchParams.delete(key))
  window.history.replaceState({}, "", url.toString())
}

