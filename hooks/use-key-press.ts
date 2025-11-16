"use client"

import { useEffect } from "react"

type KeyPressHandler = (event: KeyboardEvent) => void

/**
 * Hook to handle key press events
 */
export function useKeyPress(
  targetKey: string | string[],
  handler: KeyPressHandler,
  options: {
    enabled?: boolean
    target?: "window" | "document"
  } = {}
): void {
  const { enabled = true, target = "window" } = options
  const keys = Array.isArray(targetKey) ? targetKey : [targetKey]

  useEffect(() => {
    if (!enabled) return

    const handleKeyPress = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent
      if (keys.includes(keyboardEvent.key) || keys.includes(keyboardEvent.code)) {
        handler(keyboardEvent)
      }
    }

    const targetElement = target === "window" ? window : document
    targetElement.addEventListener("keydown", handleKeyPress)

    return () => {
      targetElement.removeEventListener("keydown", handleKeyPress)
    }
  }, [keys, handler, enabled, target])
}

/**
 * Hook to handle Escape key press
 */
export function useEscapeKey(handler: () => void, enabled: boolean = true): void {
  useKeyPress("Escape", () => handler(), { enabled })
}

/**
 * Hook to handle Enter key press
 */
export function useEnterKey(handler: () => void, enabled: boolean = true): void {
  useKeyPress("Enter", () => handler(), { enabled })
}

