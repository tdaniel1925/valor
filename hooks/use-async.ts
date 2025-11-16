"use client"

import { useState, useCallback } from "react"

interface UseAsyncOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseAsyncReturn<T> {
  data: T | null
  error: Error | null
  loading: boolean
  execute: (...args: any[]) => Promise<T | undefined>
  reset: () => void
}

export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true)
      setError(null)

      try {
        const result = await asyncFunction(...args)
        setData(result)
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        options.onError?.(error)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    error,
    loading,
    execute,
    reset,
  }
}

