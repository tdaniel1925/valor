"use client"

import { useState, useMemo } from "react"

type FilterFunction<T> = (item: T) => boolean

interface UseFilterProps<T> {
  data: T[]
  filters?: Record<string, FilterFunction<T>>
}

interface UseFilterReturn<T> {
  filteredData: T[]
  activeFilters: Record<string, FilterFunction<T>>
  addFilter: (key: string, filter: FilterFunction<T>) => void
  removeFilter: (key: string) => void
  clearFilters: () => void
}

export function useFilter<T>({
  data,
  filters = {},
}: UseFilterProps<T>): UseFilterReturn<T> {
  const [activeFilters, setActiveFilters] =
    useState<Record<string, FilterFunction<T>>>(filters)

  const filteredData = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return data

    return data.filter((item) => {
      return Object.values(activeFilters).every((filter) => filter(item))
    })
  }, [data, activeFilters])

  const addFilter = (key: string, filter: FilterFunction<T>) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: filter,
    }))
  }

  const removeFilter = (key: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  const clearFilters = () => {
    setActiveFilters({})
  }

  return {
    filteredData,
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
  }
}

