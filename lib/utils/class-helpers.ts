// CSS class utility functions

import { cn } from "./cn"

/**
 * Creates conditional class names
 */
export function classNames(
  ...classes: Array<string | boolean | undefined | null>
): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Creates variant-based class names
 */
export function variantClasses<T extends string>(
  base: string,
  variants: Record<T, string>,
  variant?: T
): string {
  if (!variant || !variants[variant]) return base
  return cn(base, variants[variant])
}

/**
 * Creates size-based class names
 */
export function sizeClasses(
  base: string,
  sizes: Record<string, string>,
  size: string = "default"
): string {
  return cn(base, sizes[size] || sizes.default)
}

