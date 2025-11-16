// Query string utility functions

/**
 * Parses query string into object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/**
 * Builds query string from object
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}

/**
 * Updates query string parameter
 */
export function updateQueryParam(
  currentQuery: string,
  key: string,
  value: string | number | boolean | null | undefined
): string {
  const params = new URLSearchParams(currentQuery)
  if (value === null || value === undefined) {
    params.delete(key)
  } else {
    params.set(key, String(value))
  }
  return params.toString()
}

/**
 * Removes query string parameter
 */
export function removeQueryParam(currentQuery: string, key: string): string {
  const params = new URLSearchParams(currentQuery)
  params.delete(key)
  return params.toString()
}

/**
 * Gets query parameter value
 */
export function getQueryParam(
  queryString: string,
  key: string
): string | null {
  const params = new URLSearchParams(queryString)
  return params.get(key)
}

/**
 * Gets all query parameters for a key (for arrays)
 */
export function getAllQueryParams(
  queryString: string,
  key: string
): string[] {
  const params = new URLSearchParams(queryString)
  return params.getAll(key)
}

