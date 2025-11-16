"use client"

import { useState, useCallback } from "react"
import { copyToClipboard } from "@/lib/utils/copy-helpers"

interface UseCopyReturn {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  reset: () => void
}

/**
 * Hook for copying text to clipboard
 */
export function useCopy(): UseCopyReturn {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    return success
  }, [])

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return {
    copy,
    copied,
    reset,
  }
}

