"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

export type SortDirection = "asc" | "desc" | null

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  keyExtractor: (row: T) => string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (columnKey: keyof T | string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    const aValue = a[sortColumn as keyof T]
    const bValue = b[sortColumn as keyof T]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    // Type guard for Date objects
    const isDate = (value: unknown): value is Date => value instanceof Date

    if (isDate(aValue) && isDate(bValue)) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    return 0
  })

  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="h-12 px-4 text-left align-middle font-medium"
              >
                {column.sortable !== false ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                    {getSortIcon(column.key)}
                  </Button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={`border-b transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="p-4 align-middle">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          )}
        </tbody>
      </table>
    </div>
  )
}

