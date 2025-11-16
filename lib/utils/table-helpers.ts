// Table utility functions

/**
 * Gets paginated slice of data
 */
export function paginate<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return data.slice(startIndex, endIndex)
}

/**
 * Sorts data by key
 */
export function sortBy<T>(
  data: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue)
      return direction === "asc" ? comparison : -comparison
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })
}

/**
 * Filters data by multiple conditions
 */
export function filterBy<T>(
  data: T[],
  filters: Array<(item: T) => boolean>
): T[] {
  return data.filter((item) => filters.every((filter) => filter(item)))
}

/**
 * Searches data by text in specified fields
 */
export function searchIn<T>(
  data: T[],
  query: string,
  fields: Array<keyof T>
): T[] {
  if (!query.trim()) return data

  const lowerQuery = query.toLowerCase()
  return data.filter((item) =>
    fields.some((field) => {
      const value = item[field]
      return (
        value &&
        String(value).toLowerCase().includes(lowerQuery)
      )
    })
  )
}

/**
 * Groups data by key
 */
export function groupBy<T, K extends keyof T>(
  data: T[],
  key: K
): Record<string, T[]> {
  return data.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Calculates pagination info
 */
export function getPaginationInfo(
  totalItems: number,
  currentPage: number,
  pageSize: number
) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

