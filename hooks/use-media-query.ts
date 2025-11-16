"use client"

import { useState, useEffect } from "react"

/**
 * Hook to match media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Create listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

/**
 * Hook to check if screen is mobile
 */
export function useIsMobileMedia(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

/**
 * Hook to check if screen is tablet
 */
export function useIsTabletMedia(): boolean {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
}

/**
 * Hook to check if screen is desktop
 */
export function useIsDesktopMedia(): boolean {
  return useMediaQuery("(min-width: 1025px)")
}

/**
 * Hook to check if screen is dark mode
 */
export function useIsDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)")
}

