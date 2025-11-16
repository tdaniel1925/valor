// Event utility functions

/**
 * Prevents default and stops propagation
 */
export function preventDefaultAndStopPropagation(
  e: React.SyntheticEvent
): void {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * Creates a debounced event handler
 */
export function debounceEvent<T extends (...args: any[]) => any>(
  handler: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      handler(...args)
    }, delay)
  }
}

/**
 * Creates a throttled event handler
 */
export function throttleEvent<T extends (...args: any[]) => any>(
  handler: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      handler(...args)
    }
  }
}

/**
 * Checks if event target is within element
 */
export function isEventTargetWithin(
  event: React.MouseEvent | MouseEvent,
  element: HTMLElement | null
): boolean {
  if (!element) return false
  return element.contains(event.target as Node)
}

/**
 * Gets mouse position relative to element
 */
export function getRelativeMousePosition(
  event: React.MouseEvent | MouseEvent,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

