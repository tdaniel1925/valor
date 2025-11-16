"use client"

import { useState, useCallback } from "react"

interface UseSelectProps<T> {
  items: T[]
  keyExtractor: (item: T) => string | number
  initialSelected?: (string | number)[]
  multiSelect?: boolean
}

interface UseSelectReturn<T> {
  selected: (string | number)[]
  isSelected: (item: T) => boolean
  toggle: (item: T) => void
  select: (item: T) => void
  deselect: (item: T) => void
  selectAll: () => void
  deselectAll: () => void
  isAllSelected: boolean
  isSomeSelected: boolean
}

export function useSelect<T>({
  items,
  keyExtractor,
  initialSelected = [],
  multiSelect = true,
}: UseSelectProps<T>): UseSelectReturn<T> {
  const [selected, setSelected] = useState<(string | number)[]>(initialSelected)

  const isSelected = useCallback(
    (item: T) => {
      const key = keyExtractor(item)
      return selected.includes(key)
    },
    [selected, keyExtractor]
  )

  const toggle = useCallback(
    (item: T) => {
      const key = keyExtractor(item)
      setSelected((prev) => {
        if (prev.includes(key)) {
          return prev.filter((k) => k !== key)
        } else {
          if (multiSelect) {
            return [...prev, key]
          } else {
            return [key]
          }
        }
      })
    },
    [keyExtractor, multiSelect]
  )

  const select = useCallback(
    (item: T) => {
      const key = keyExtractor(item)
      setSelected((prev) => {
        if (prev.includes(key)) return prev
        if (multiSelect) {
          return [...prev, key]
        } else {
          return [key]
        }
      })
    },
    [keyExtractor, multiSelect]
  )

  const deselect = useCallback(
    (item: T) => {
      const key = keyExtractor(item)
      setSelected((prev) => prev.filter((k) => k !== key))
    },
    [keyExtractor]
  )

  const selectAll = useCallback(() => {
    if (!multiSelect) return
    setSelected(items.map(keyExtractor))
  }, [items, keyExtractor, multiSelect])

  const deselectAll = useCallback(() => {
    setSelected([])
  }, [])

  const isAllSelected =
    items.length > 0 && selected.length === items.length
  const isSomeSelected = selected.length > 0 && selected.length < items.length

  return {
    selected,
    isSelected,
    toggle,
    select,
    deselect,
    selectAll,
    deselectAll,
    isAllSelected,
    isSomeSelected,
  }
}

