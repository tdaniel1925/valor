// Form-specific types

export interface CaseFormData {
  type: "life" | "term" | "annuity" | "other"
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "pending_requirements" | "issued"
  clientName: string
  clientEmail?: string
  clientPhone?: string
  carrier?: string
  product?: string
  faceAmount?: string
  premium?: string
}

export interface QuoteFormData {
  type: "life" | "term" | "annuity"
  carrier?: string
  product?: string
  faceAmount?: string
  premium?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}

export interface ContractFormData {
  carrier: string
  commissionRate?: number
  notes?: string
}

export interface NoteFormData {
  content: string
  isInternal: boolean
}

export interface ProfileFormData {
  firstName?: string
  lastName?: string
  phone?: string
}

