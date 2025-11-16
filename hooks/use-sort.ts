"use client"

import { useState, useMemo } from "react"

type SortDirection = "asc" | "desc"

interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

interface UseSortProps<T> {
  data: T[]
  initialSort?: SortConfig<T>
}

interface UseSortReturn<T> {
  sortedData: T[]
  sortConfig: SortConfig<T> | null
  handleSort: (key: keyof T) => void
  setSort: (config: SortConfig<T>) => void
  clearSort: () => void
}

export function useSort<T extends Record<string, any>>({
  data,
  initialSort,
}: UseSortProps<T>): UseSortReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSort || null
  )

  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === "asc" ? comparison : -comparison
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue
      }

      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key: keyof T) => {
    if (sortConfig?.key === key) {
      // Toggle direction if same key
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      })
    } else {
      // New key, default to ascending
      setSortConfig({ key, direction: "asc" })
    }
  }

  const setSort = (config: SortConfig<T>) => {
    setSortConfig(config)
  }

  const clearSort = () => {
    setSortConfig(null)
  }

  return {
    sortedData,
    sortConfig,
    handleSort,
    setSort,
    clearSort,
  }
}

