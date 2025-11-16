"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StatusSelector } from "@/components/status/status-selector"
import { showSuccess, showError } from "@/lib/utils/toast-helpers"

interface BulkStatusUpdateProps {
  selectedIds: string[]
  currentStatus?: string
  onUpdate: (ids: string[], status: string) => Promise<void>
  onComplete?: () => void
  statusOptions: Array<{ value: string; label: string; color?: string }>
}

export function BulkStatusUpdate({
  selectedIds,
  currentStatus,
  onUpdate,
  onComplete,
  statusOptions,
}: BulkStatusUpdateProps) {
  const [status, setStatus] = useState(currentStatus || "")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!status) {
      showError("Please select a status")
      return
    }

    setLoading(true)
    try {
      await onUpdate(selectedIds, status)
      showSuccess(`Updated ${selectedIds.length} item(s)`)
      onComplete?.()
    } catch (error) {
      showError("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      <StatusSelector
        value={status}
        options={statusOptions}
        onValueChange={setStatus}
        size="sm"
      />
      <Button
        size="sm"
        onClick={handleUpdate}
        disabled={loading || !status}
      >
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </div>
  )
}

