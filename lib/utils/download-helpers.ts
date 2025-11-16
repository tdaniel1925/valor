// Download utility functions

/**
 * Downloads a file from a URL
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Downloads text content as a file
 */
export function downloadText(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  downloadFile(url, filename)
  URL.revokeObjectURL(url)
}

/**
 * Downloads JSON as a file
 */
export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  downloadText(jsonString, `${filename}.json`, "application/json")
}

/**
 * Downloads CSV content as a file
 */
export function downloadCSVContent(content: string, filename: string): void {
  downloadText(content, `${filename}.csv`, "text/csv;charset=utf-8;")
}

/**
 * Downloads blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  downloadFile(url, filename)
  URL.revokeObjectURL(url)
}

/**
 * Downloads data URL as a file
 */
export function downloadDataURL(dataUrl: string, filename: string): void {
  downloadFile(dataUrl, filename)
}

