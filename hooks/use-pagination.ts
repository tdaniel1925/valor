"use client"

import { useState, useMemo } from "react"

interface UsePaginationProps {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function usePagination({
  totalItems,
  itemsPerPage = 20,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  const canGoNext = currentPage < totalPages
  const canGoPrevious = currentPage > 1

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
  }
}

