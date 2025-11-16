// Export utility functions

/**
 * Converts data to CSV format
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return ""

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0])
  
  // Create header row
  const headerRow = csvHeaders.map(escapeCSV).join(",")

  // Create data rows
  const rows = data.map((item) =>
    csvHeaders.map((header) => escapeCSV(item[header] || "")).join(",")
  )

  return [headerRow, ...rows].join("\n")
}

/**
 * Escapes CSV values
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return ""
  
  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Downloads CSV file
 */
export function downloadCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: string[]
): void {
  const csv = convertToCSV(data, headers)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Converts data to JSON format
 */
export function convertToJSON<T>(data: T[]): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Downloads JSON file
 */
export function downloadJSON<T>(data: T[], filename: string): void {
  const json = convertToJSON(data)
  const blob = new Blob([json], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Formats data for Excel export (TSV format)
 */
export function convertToTSV<T extends Record<string, any>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return ""

  const tsvHeaders = headers || Object.keys(data[0])
  const headerRow = tsvHeaders.join("\t")
  const rows = data.map((item) =>
    tsvHeaders.map((header) => String(item[header] || "")).join("\t")
  )

  return [headerRow, ...rows].join("\n")
}

/**
 * Downloads TSV file (Excel-compatible)
 */
export function downloadTSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: string[]
): void {
  const tsv = convertToTSV(data, headers)
  const blob = new Blob([tsv], { type: "text/tab-separated-values" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.tsv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Prepares data for export (flattens nested objects)
 */
export function prepareForExport<T extends Record<string, any>>(
  data: T[],
  fieldMapping?: Record<string, string>
): Record<string, any>[] {
  return data.map((item) => {
    const flattened: Record<string, any> = {}

    Object.keys(item).forEach((key) => {
      const value = item[key]
      const exportKey = fieldMapping?.[key] || key

      if (value === null || value === undefined) {
        flattened[exportKey] = ""
      } else if (typeof value === "object" && !(value instanceof Date)) {
        flattened[exportKey] = JSON.stringify(value)
      } else if (value instanceof Date) {
        flattened[exportKey] = value.toISOString()
      } else {
        flattened[exportKey] = value
      }
    })

    return flattened
  })
}

