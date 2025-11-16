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
import { showSuccess, showError } from "@/lib/utils/toast-helpers"

export function QuoteForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: "life" as "life" | "term" | "annuity",
    carrier: "",
    product: "",
    faceAmount: "",
    premium: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const clientData = {
        name: formData.clientName,
        email: formData.clientEmail,
        phone: formData.clientPhone,
      }

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          carrier: formData.carrier,
          product: formData.product,
          faceAmount: formData.faceAmount,
          premium: formData.premium,
          clientData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.message || "Failed to create quote"
        setError(errorMessage)
        showError(errorMessage)
        setLoading(false)
        return
      }

      showSuccess("Quote created successfully")
      router.push("/quotes")
      router.refresh()
    } catch (err) {
      const errorMessage = "An unexpected error occurred"
      setError(errorMessage)
      showError(errorMessage)
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
          <Label htmlFor="type">Quote Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "life" | "term" | "annuity") =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quote type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="life">Life Insurance</SelectItem>
              <SelectItem value="term">Term Insurance</SelectItem>
              <SelectItem value="annuity">Annuity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="carrier">Carrier</Label>
            <Input
              id="carrier"
              value={formData.carrier}
              onChange={(e) =>
                setFormData({ ...formData, carrier: e.target.value })
              }
              placeholder="Enter carrier name"
            />
          </div>

          <div>
            <Label htmlFor="product">Product</Label>
            <Input
              id="product"
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="faceAmount">Face Amount</Label>
            <Input
              id="faceAmount"
              value={formData.faceAmount}
              onChange={(e) =>
                setFormData({ ...formData, faceAmount: e.target.value })
              }
              placeholder="e.g., $500,000"
            />
          </div>

          <div>
            <Label htmlFor="premium">Premium</Label>
            <Input
              id="premium"
              value={formData.premium}
              onChange={(e) =>
                setFormData({ ...formData, premium: e.target.value })
              }
              placeholder="e.g., $500/month"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Client Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                placeholder="Enter client name"
              />
            </div>

            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
                placeholder="client@example.com"
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, clientPhone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Quote"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
