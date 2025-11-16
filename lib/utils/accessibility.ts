// Accessibility utilities

/**
 * Generates a unique ID for form fields
 */
export function generateId(prefix: string = "field"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Formats ARIA labels for screen readers
 */
export function formatAriaLabel(
  action: string,
  item: string,
  context?: string
): string {
  if (context) {
    return `${action} ${item} ${context}`
  }
  return `${action} ${item}`
}

/**
 * Gets accessible name for an element
 */
export function getAccessibleName(
  label?: string,
  ariaLabel?: string,
  ariaLabelledBy?: string
): string | undefined {
  if (ariaLabel) return ariaLabel
  if (label) return label
  return undefined
}

/**
 * Validates ARIA attributes
 */
export function validateAriaAttributes(
  ariaLabel?: string,
  ariaLabelledBy?: string,
  ariaDescribedBy?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (ariaLabel && ariaLabelledBy) {
    errors.push("Cannot use both aria-label and aria-labelledby")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Keyboard navigation helpers
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) {
  switch (event.key) {
    case "Enter":
      event.preventDefault()
      onEnter?.()
      break
    case "Escape":
      event.preventDefault()
      onEscape?.()
      break
    case "ArrowUp":
      event.preventDefault()
      onArrowUp?.()
      break
    case "ArrowDown":
      event.preventDefault()
      onArrowDown?.()
      break
  }
}

/**
 * Focus management
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleTab(e: KeyboardEvent) {
    if (e.key !== "Tab") return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener("keydown", handleTab)

  return () => {
    element.removeEventListener("keydown", handleTab)
  }
}

