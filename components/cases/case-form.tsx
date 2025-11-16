"use client"

import { useState, useEffect } from "react"
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

interface CaseData {
  id?: string
  type: string
  status: string
  clientInfo?: any
  carrier?: string | null
  product?: string | null
  faceAmount?: string | null
  premium?: string | null
}

interface CaseFormProps {
  caseData?: CaseData
}

export function CaseForm({ caseData }: CaseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!caseData
  const clientInfo = caseData?.clientInfo as any
  
  const [formData, setFormData] = useState({
    type: (caseData?.type as any) || "life",
    status: (caseData?.status as any) || "draft",
    clientName: clientInfo?.name || "",
    clientEmail: clientInfo?.email || "",
    clientPhone: clientInfo?.phone || "",
    carrier: caseData?.carrier || "",
    product: caseData?.product || "",
    faceAmount: caseData?.faceAmount || "",
    premium: caseData?.premium || "",
  })

  useEffect(() => {
    if (caseData) {
      const clientInfo = caseData.clientInfo as any
      setFormData({
        type: (caseData.type as any) || "life",
        status: (caseData.status as any) || "draft",
        clientName: clientInfo?.name || "",
        clientEmail: clientInfo?.email || "",
        clientPhone: clientInfo?.phone || "",
        carrier: caseData.carrier || "",
        product: caseData.product || "",
        faceAmount: caseData.faceAmount || "",
        premium: caseData.premium || "",
      })
    }
  }, [caseData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const clientInfo = {
        name: formData.clientName,
        email: formData.clientEmail,
        phone: formData.clientPhone,
      }

      const url = isEditMode ? `/api/cases/${caseData.id}` : "/api/cases"
      const method = isEditMode ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          status: formData.status,
          clientInfo,
          carrier: formData.carrier,
          product: formData.product,
          faceAmount: formData.faceAmount,
          premium: formData.premium,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.message || `Failed to ${isEditMode ? "update" : "create"} case`
        setError(errorMessage)
        showError(errorMessage)
        setLoading(false)
        return
      }

      showSuccess(`Case ${isEditMode ? "updated" : "created"} successfully`)
      router.push("/cases")
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
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="type">Case Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "life" | "term" | "annuity" | "other") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="life">Life Insurance</SelectItem>
                <SelectItem value="term">Term Insurance</SelectItem>
                <SelectItem value="annuity">Annuity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending_requirements">Pending Requirements</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              required
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
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
            />
          </div>

          <div>
            <Label htmlFor="carrier">Carrier</Label>
            <Input
              id="carrier"
              value={formData.carrier}
              onChange={(e) =>
                setFormData({ ...formData, carrier: e.target.value })
              }
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
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Case" : "Create Case")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

