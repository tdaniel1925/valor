// Extended string utility functions

/**
 * Capitalizes first letter
 */
export function capitalize(str: string): string {
  if (!str) return str
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
 * Converts string to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, "")
}

/**
 * Converts string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

/**
 * Converts string to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase()
}

/**
 * Converts string to slug
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
 * Truncates string with ellipsis
 */
export function truncate(str: string, length: number, suffix: string = "..."): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

/**
 * Truncates string at word boundary
 */
export function truncateWords(str: string, wordCount: number, suffix: string = "..."): string {
  const words = str.split(/\s+/)
  if (words.length <= wordCount) return str
  return words.slice(0, wordCount).join(" ") + suffix
}

/**
 * Masks sensitive information
 */
export function maskSensitive(str: string, visibleChars: number = 4): string {
  if (str.length <= visibleChars * 2) {
    return "*".repeat(str.length)
  }
  const start = str.slice(0, visibleChars)
  const end = str.slice(-visibleChars)
  const middle = "*".repeat(str.length - visibleChars * 2)
  return `${start}${middle}${end}`
}

/**
 * Masks email
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@")
  if (!domain) return maskSensitive(email)
  const maskedLocal = maskSensitive(localPart, 2)
  return `${maskedLocal}@${domain}`
}

/**
 * Masks phone number
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length <= 4) return "*".repeat(phone.length)
  return phone.slice(0, -4) + "****"
}

/**
 * Removes HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

/**
 * Escapes HTML
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return str.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Unescapes HTML
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
  }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => map[m])
}

/**
 * Extracts URLs from string
 */
export function extractUrls(str: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return str.match(urlRegex) || []
}

/**
 * Extracts emails from string
 */
export function extractEmails(str: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  return str.match(emailRegex) || []
}

/**
 * Checks if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Checks if string is valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Normalizes whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim()
}

/**
 * Removes diacritics (accents)
 */
export function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

