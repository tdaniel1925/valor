// File utility functions

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

/**
 * Gets file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "")
}

/**
 * Formats file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Validates file type
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validates file size
 */
export function isValidFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes
}

/**
 * Reads file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Reads file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * Downloads a file
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Creates a file from blob
 */
export function createFileFromBlob(
  blob: Blob,
  filename: string,
  mimeType: string
): File {
  return new File([blob], filename, { type: mimeType })
}

