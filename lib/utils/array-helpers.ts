// Array utility functions

/**
 * Groups array items by a key
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sorts array by multiple criteria
 */
export function sortBy<T>(
  array: T[],
  ...sortFns: Array<(item: T) => number | string>
): T[] {
  return [...array].sort((a, b) => {
    for (const sortFn of sortFns) {
      const aVal = sortFn(a)
      const bVal = sortFn(b)

      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
    }
    return 0
  })
}

/**
 * Removes duplicates from array
 */
export function unique<T>(array: T[], keyFn?: (item: T) => any): T[] {
  if (!keyFn) {
    return Array.from(new Set(array))
  }

  const seen = new Set()
  return array.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Chunks array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Flattens nested arrays
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

