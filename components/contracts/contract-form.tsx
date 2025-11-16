"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ContractForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    carrier: "",
    commissionRate: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrier: formData.carrier,
          commissionRate: formData.commissionRate ? parseFloat(formData.commissionRate) : null,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setError(error.message || "Failed to create contract request")
        setLoading(false)
        return
      }

      router.push("/contracts")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="carrier">Carrier *</Label>
          <Input
            id="carrier"
            required
            value={formData.carrier}
            onChange={(e) =>
              setFormData({ ...formData, carrier: e.target.value })
            }
            placeholder="Enter carrier name"
          />
        </div>

        <div>
          <Label htmlFor="commissionRate">Commission Rate (%)</Label>
          <Input
            id="commissionRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.commissionRate}
            onChange={(e) =>
              setFormData({ ...formData, commissionRate: e.target.value })
            }
            placeholder="e.g., 5.5"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Additional information about this contract request..."
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Contract Request"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

