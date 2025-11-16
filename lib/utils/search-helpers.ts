// Search utility functions

/**
 * Simple text search in string
 */
export function searchText(text: string, query: string): boolean {
  if (!query.trim()) return true
  return text.toLowerCase().includes(query.toLowerCase())
}

/**
 * Search in multiple fields
 */
export function searchInFields<T>(
  item: T,
  query: string,
  fields: Array<keyof T>
): boolean {
  if (!query.trim()) return true

  const lowerQuery = query.toLowerCase()
  return fields.some((field) => {
    const value = item[field]
    if (value === null || value === undefined) return false
    return String(value).toLowerCase().includes(lowerQuery)
  })
}

/**
 * Fuzzy search (simple implementation)
 */
export function fuzzySearch(text: string, query: string): boolean {
  if (!query.trim()) return true

  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()
  let textIndex = 0

  for (let i = 0; i < queryLower.length; i++) {
    const char = queryLower[i]
    const foundIndex = textLower.indexOf(char, textIndex)
    if (foundIndex === -1) return false
    textIndex = foundIndex + 1
  }

  return true
}

/**
 * Search with highlighting (returns parts to highlight)
 */
export function highlightSearch(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  if (!query.trim()) return [{ text, highlight: false }]

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const parts: Array<{ text: string; highlight: boolean }> = []
  let lastIndex = 0
  let index = lowerText.indexOf(lowerQuery, lastIndex)

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, index),
        highlight: false,
      })
    }
    parts.push({
      text: text.slice(index, index + query.length),
      highlight: true,
    })
    lastIndex = index + query.length
    index = lowerText.indexOf(lowerQuery, lastIndex)
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false,
    })
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }]
}

/**
 * Search with ranking (simple relevance scoring)
 */
export function searchWithRanking<T>(
  items: T[],
  query: string,
  fields: Array<keyof T>
): Array<{ item: T; score: number }> {
  if (!query.trim()) {
    return items.map((item) => ({ item, score: 0 }))
  }

  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 0)

  return items
    .map((item) => {
      let score = 0

      fields.forEach((field) => {
        const value = String(item[field] || "").toLowerCase()

        // Exact match gets highest score
        if (value === lowerQuery) {
          score += 100
        }
        // Starts with query gets high score
        else if (value.startsWith(lowerQuery)) {
          score += 50
        }
        // Contains query gets medium score
        else if (value.includes(lowerQuery)) {
          score += 25
        }

        // Word matches get additional points
        queryWords.forEach((word) => {
          if (value.includes(word)) {
            score += 10
          }
        })
      })

      return { item, score }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
}

/**
 * Advanced search with filters
 */
export interface SearchFilter<T> {
  field: keyof T
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte"
  value: any
}

export function advancedSearch<T>(
  items: T[],
  filters: SearchFilter<T>[]
): T[] {
  return items.filter((item) => {
    return filters.every((filter) => {
      const fieldValue = item[filter.field]
      const filterValue = filter.value

      switch (filter.operator) {
        case "equals":
          return fieldValue === filterValue
        case "contains":
          return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase())
        case "startsWith":
          return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
        case "endsWith":
          return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase())
        case "gt":
          return Number(fieldValue) > Number(filterValue)
        case "lt":
          return Number(fieldValue) < Number(filterValue)
        case "gte":
          return Number(fieldValue) >= Number(filterValue)
        case "lte":
          return Number(fieldValue) <= Number(filterValue)
        default:
          return true
      }
    })
  })
}

