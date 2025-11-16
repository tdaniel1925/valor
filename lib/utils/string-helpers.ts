// String utility functions

/**
 * Capitalizes first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Converts string to title case
 */
export function titleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ")
}

/**
 * Converts camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Converts kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Truncates string to max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + "..."
}

/**
 * Removes HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

/**
 * Generates a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Masks sensitive data (e.g., email, phone)
 */
export function maskSensitive(str: string, type: "email" | "phone" | "ssn" = "email"): string {
  switch (type) {
    case "email":
      const [local, domain] = str.split("@")
      if (!domain) return str
      const maskedLocal = local.slice(0, 2) + "***"
      return `${maskedLocal}@${domain}`
    case "phone":
      const cleaned = str.replace(/\D/g, "")
      if (cleaned.length === 10) {
        return `***-***-${cleaned.slice(-4)}`
      }
      return str
    case "ssn":
      return `***-**-${str.slice(-4)}`
    default:
      return str
  }
}

