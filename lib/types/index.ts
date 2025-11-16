// Shared TypeScript types and interfaces

export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  organizationId?: string | null
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Case {
  id: string
  caseNumber?: string | null
  type: "life" | "term" | "annuity" | "other"
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "pending_requirements"
    | "issued"
  agentId: string
  clientInfo?: Record<string, any>
  carrier?: string | null
  product?: string | null
  faceAmount?: string | null
  premium?: string | null
  submittedAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Quote {
  id: string
  quoteNumber?: string | null
  type: "life" | "term" | "annuity"
  agentId: string
  carrier?: string | null
  product?: string | null
  faceAmount?: string | null
  premium?: string | null
  clientData?: Record<string, any>
  pdfUrl?: string | null
  externalQuoteId?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Commission {
  id: string
  caseId?: string | null
  agentId: string
  amount: string | number
  status: "pending" | "paid" | "cancelled"
  paidAt?: Date | string | null
  period?: string | null
  notes?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Contract {
  id: string
  contractNumber?: string | null
  carrier: string
  agentId: string
  commissionRate?: string | null
  status:
    | "pending"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "active"
    | "inactive"
  effectiveDate?: Date | string | null
  expirationDate?: Date | string | null
  documentUrl?: string | null
  notes?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Note {
  id: string
  caseId: string
  userId: string
  content: string
  isInternal: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId?: string | null
  description: string
  metadata?: Record<string, any> | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date | string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  message?: string
  code?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

// Re-export API and form types
export * from "./api"
export * from "./forms"
