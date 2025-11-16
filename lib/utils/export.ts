// Export utilities for CSV, Excel, etc.

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
) {
  if (data.length === 0) {
    return
  }

  // Get headers
  const csvHeaders = headers
    ? Object.values(headers)
    : Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    csvHeaders.join(","),
    ...data.map((row) =>
      Object.values(row)
        .map((val) => {
          // Escape commas and quotes
          const str = String(val ?? "")
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        })
        .join(",")
    ),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatDateForExport(date: Date | string | null | undefined): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US")
}

export function formatCurrencyForExport(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return ""
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return num.toFixed(2)
}

