"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import {
  parseQueryString,
  buildQueryString,
  updateQueryParam,
  removeQueryParam,
} from "@/lib/utils/query-string-helpers"

/**
 * Hook for managing URL query parameters
 */
export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key)
    },
    [searchParams]
  )

  const getAllParams = useCallback(
    (key: string): string[] => {
      return searchParams.getAll(key)
    },
    [searchParams]
  )

  const setParam = useCallback(
    (key: string, value: string | number | boolean | null | undefined) => {
      const current = searchParams.toString()
      const updated = updateQueryParam(current, key, value)
      router.push(`${pathname}?${updated}`)
    },
    [searchParams, router, pathname]
  )

  const removeParam = useCallback(
    (key: string) => {
      const current = searchParams.toString()
      const updated = removeQueryParam(current, key)
      router.push(`${pathname}?${updated}`)
    },
    [searchParams, router, pathname]
  )

  const setParams = useCallback(
    (params: Record<string, string | number | boolean | null | undefined>) => {
      const current = parseQueryString(searchParams.toString())
      const updated = { ...current, ...params }
      const queryString = buildQueryString(updated)
      router.push(`${pathname}?${queryString}`)
    },
    [searchParams, router, pathname]
  )

  const clearParams = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const getAll = useCallback(() => {
    return parseQueryString(searchParams.toString())
  }, [searchParams])

  return {
    getParam,
    getAllParams,
    setParam,
    removeParam,
    setParams,
    clearParams,
    getAll,
  }
}

