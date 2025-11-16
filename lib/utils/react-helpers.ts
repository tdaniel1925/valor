// React-specific utility functions
import * as React from "react"

/**
 * Combines multiple refs into a single ref callback
 */
export function combineRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

/**
 * Prevents default event behavior
 */
export function preventDefault<T extends React.SyntheticEvent>(
  handler?: (event: T) => void
) {
  return (event: T) => {
    event.preventDefault()
    handler?.(event)
  }
}

/**
 * Stops event propagation
 */
export function stopPropagation<T extends React.SyntheticEvent>(
  handler?: (event: T) => void
) {
  return (event: T) => {
    event.stopPropagation()
    handler?.(event)
  }
}

