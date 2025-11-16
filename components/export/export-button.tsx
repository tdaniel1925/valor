"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/utils/export"

interface ExportButtonProps<T extends Record<string, any>> {
  data: T[]
  filename: string
  headers?: Record<keyof T, string>
  disabled?: boolean
}

export function ExportButton<T extends Record<string, any>>({
  data,
  filename,
  headers,
  disabled,
}: ExportButtonProps<T>) {
  const handleExport = () => {
    exportToCSV(data, filename, headers)
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || data.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  )
}

