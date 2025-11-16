"use client"

import { useState, useEffect } from "react"

/**
 * Hook to check if component is mounted (client-side only)
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return isMounted
}

