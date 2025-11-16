"use client"

import { useState, useMemo } from "react"
import { useDebounce } from "./use-debounce"
import { searchInFields, searchWithRanking } from "@/lib/utils/search-helpers"

interface UseSearchProps<T> {
  data: T[]
  searchFields: Array<keyof T>
  debounceMs?: number
  ranking?: boolean
}

interface UseSearchReturn<T> {
  query: string
  setQuery: (query: string) => void
  results: T[]
  rankedResults?: Array<{ item: T; score: number }>
  isSearching: boolean
  clearSearch: () => void
}

export function useSearch<T extends Record<string, any>>({
  data,
  searchFields,
  debounceMs = 300,
  ranking = false,
}: UseSearchProps<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, debounceMs)

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return data

    if (ranking) {
      const ranked = searchWithRanking(data, debouncedQuery, searchFields)
      return ranked.map((r) => r.item)
    }

    return data.filter((item) =>
      searchInFields(item, debouncedQuery, searchFields)
    )
  }, [data, debouncedQuery, searchFields, ranking])

  const rankedResults = useMemo(() => {
    if (!ranking || !debouncedQuery.trim()) return undefined
    return searchWithRanking(data, debouncedQuery, searchFields)
  }, [data, debouncedQuery, searchFields, ranking])

  const clearSearch = () => {
    setQuery("")
  }

  return {
    query,
    setQuery,
    results,
    rankedResults,
    isSearching: query !== debouncedQuery,
    clearSearch,
  }
}

