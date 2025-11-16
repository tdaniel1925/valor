// Extended array utility functions

/**
 * Removes duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * Removes duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Groups array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Partitions array into two arrays based on predicate
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = []
  const falsy: T[] = []

  array.forEach((item) => {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  })

  return [truthy, falsy]
}

/**
 * Flattens nested array
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flatten(item as (T | T[])[]))
    }
    return acc.concat([item as T])
  }, [])
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
 * Gets intersection of two arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => array2.includes(item))
}

/**
 * Gets difference of two arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item))
}

/**
 * Gets union of two arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2])
}

/**
 * Shuffles array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Gets random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Gets random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array)
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * Moves item in array
 */
export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const newArray = [...array]
  const [removed] = newArray.splice(fromIndex, 1)
  newArray.splice(toIndex, 0, removed)
  return newArray
}

/**
 * Swaps items in array
 */
export function swapItems<T>(array: T[], index1: number, index2: number): T[] {
  const newArray = [...array]
  ;[newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]]
  return newArray
}

/**
 * Inserts item at index
 */
export function insertAt<T>(array: T[], index: number, item: T): T[] {
  const newArray = [...array]
  newArray.splice(index, 0, item)
  return newArray
}

/**
 * Removes item at index
 */
export function removeAt<T>(array: T[], index: number): T[] {
  const newArray = [...array]
  newArray.splice(index, 1)
  return newArray
}

/**
 * Updates item at index
 */
export function updateAt<T>(array: T[], index: number, item: T): T[] {
  const newArray = [...array]
  newArray[index] = item
  return newArray
}

