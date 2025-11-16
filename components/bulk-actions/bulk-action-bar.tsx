"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Download, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BulkActionBarProps<T> {
  selectedItems: T[]
  onClearSelection: () => void
  onBulkDelete?: (items: T[]) => void
  onBulkExport?: (items: T[]) => void
  getItemId: (item: T) => string
}

export function BulkActionBar<T>({
  selectedItems,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  getItemId,
}: BulkActionBarProps<T>) {
  const [loading, setLoading] = useState(false)

  if (selectedItems.length === 0) {
    return null
  }

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      return
    }

    setLoading(true)
    try {
      await onBulkDelete(selectedItems)
      onClearSelection()
    } catch (error) {
      console.error("Bulk delete failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkExport = () => {
    if (!onBulkExport) return
    onBulkExport(selectedItems)
    onClearSelection()
  }

  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={loading}
        >
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {onBulkExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
        )}
        {onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  )
}

