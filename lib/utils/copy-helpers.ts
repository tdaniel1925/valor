// Copy to clipboard utility functions

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (err) {
    console.error("Failed to copy text:", err)
    return false
  }
}

/**
 * Reads text from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText()
      return text
    }
    return null
  } catch (err) {
    console.error("Failed to read from clipboard:", err)
    return null
  }
}

/**
 * Copies object as JSON to clipboard
 */
export async function copyObjectAsJSON(obj: any): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(obj, null, 2)
    return await copyToClipboard(jsonString)
  } catch (err) {
    console.error("Failed to copy object as JSON:", err)
    return false
  }
}

/**
 * Copies URL to clipboard
 */
export async function copyUrl(url: string): Promise<boolean> {
  return await copyToClipboard(url)
}

/**
 * Copies current page URL to clipboard
 */
export async function copyCurrentUrl(): Promise<boolean> {
  if (typeof window === "undefined") return false
  return await copyToClipboard(window.location.href)
}

