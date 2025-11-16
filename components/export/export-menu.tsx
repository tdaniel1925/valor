"use client"

import { Download, FileText, FileSpreadsheet, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { downloadCSV, downloadTSV, downloadJSON } from "@/lib/utils/export-helpers"

interface ExportMenuProps<T extends Record<string, any>> {
  data: T[]
  filename: string
  headers?: string[]
  className?: string
}

export function ExportMenu<T extends Record<string, any>>({
  data,
  filename,
  headers,
  className,
}: ExportMenuProps<T>) {
  const handleExportCSV = () => {
    downloadCSV(data, filename, headers)
  }

  const handleExportTSV = () => {
    downloadTSV(data, filename, headers)
  }

  const handleExportJSON = () => {
    downloadJSON(data, filename)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportTSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as TSV (Excel)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

