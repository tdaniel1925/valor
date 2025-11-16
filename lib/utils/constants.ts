// Application constants

export const APP_NAME = "Valor Insurance Platform"
export const APP_DESCRIPTION = "Unified insurance back office platform"

// Status options
export const CASE_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "pending_requirements",
  "issued",
] as const

export const QUOTE_TYPES = ["life", "term", "annuity"] as const

export const COMMISSION_STATUSES = ["pending", "paid", "cancelled"] as const

export const CONTRACT_STATUSES = [
  "pending",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "active",
  "inactive",
] as const

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

// Date formats
export const DATE_FORMAT = "MMM dd, yyyy"
export const DATETIME_FORMAT = "MMM dd, yyyy hh:mm a"

// API rate limits
export const RATE_LIMITS = {
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  },
  moderate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  lenient: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
  },
} as const

// Storage buckets
export const STORAGE_BUCKETS = {
  documents: "documents",
  contracts: "contracts",
  quotes: "quotes",
} as const

