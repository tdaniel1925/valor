// API-specific types

import type { PaginationParams, PaginatedResponse } from "./index"

export interface ApiSuccessResponse<T> {
  data: T
  message?: string
}

export interface ApiErrorResponse {
  error: {
    message: string
    code?: string
    details?: Record<string, any>
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface ListQueryParams extends PaginationParams {
  search?: string
  filter?: Record<string, any>
  sort?: string
  order?: "asc" | "desc"
}

export interface ListResponse<T> extends PaginatedResponse<T> {
  filters?: Record<string, any>
}

export interface BulkOperationRequest {
  ids: string[]
  action: string
  data?: Record<string, any>
}

export interface BulkOperationResponse {
  success: boolean
  affected: number
  errors?: Array<{
    id: string
    error: string
  }>
}

