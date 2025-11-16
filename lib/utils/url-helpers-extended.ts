// Extended URL utility functions

/**
 * Builds URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl
  }

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Parses URL query parameters
 */
export function parseUrlParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  } catch {
    return {}
  }
}

/**
 * Updates URL query parameter
 */
export function updateUrlParam(
  url: string,
  key: string,
  value: string | number | boolean | null | undefined
): string {
  try {
    const urlObj = new URL(url)
    if (value === null || value === undefined) {
      urlObj.searchParams.delete(key)
    } else {
      urlObj.searchParams.set(key, String(value))
    }
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Removes URL query parameter
 */
export function removeUrlParam(url: string, key: string): string {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.delete(key)
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Gets URL parameter value
 */
export function getUrlParam(url: string, key: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get(key)
  } catch {
    return null
  }
}

/**
 * Checks if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Normalizes URL (adds protocol if missing)
 */
export function normalizeUrl(url: string, defaultProtocol: string = "https"): string {
  if (isAbsoluteUrl(url)) {
    return url
  }

  // If it starts with //, add protocol
  if (url.startsWith("//")) {
    return `${defaultProtocol}:${url}`
  }

  // If it doesn't start with http/https, add protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `${defaultProtocol}://${url}`
  }

  return url
}

/**
 * Gets domain from URL
 */
export function getDomain(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return null
  }
}

/**
 * Gets path from URL
 */
export function getPath(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch {
    return null
  }
}

