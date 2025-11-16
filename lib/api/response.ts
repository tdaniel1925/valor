// Standardized API response helpers

import { NextResponse } from "next/server"
import type { ApiResponse, ApiError } from "@/lib/types"

export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status })
}

export function errorResponse(
  error: string,
  message?: string,
  code?: string,
  status: number = 400
): NextResponse<ApiResponse<never>> {
  const apiError: ApiError = {
    error,
    ...(message && { message }),
    ...(code && { code }),
  }

  return NextResponse.json({ error: apiError }, { status })
}

export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiResponse<never>> {
  return errorResponse("Unauthorized", message, "UNAUTHORIZED", 401)
}

export function forbiddenResponse(
  message: string = "Forbidden"
): NextResponse<ApiResponse<never>> {
  return errorResponse("Forbidden", message, "FORBIDDEN", 403)
}

export function notFoundResponse(
  message: string = "Resource not found"
): NextResponse<ApiResponse<never>> {
  return errorResponse("Not Found", message, "NOT_FOUND", 404)
}

export function serverErrorResponse(
  message: string = "Internal server error"
): NextResponse<ApiResponse<never>> {
  return errorResponse("Internal Server Error", message, "SERVER_ERROR", 500)
}

export function validationErrorResponse(
  errors: Record<string, string>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      error: {
        error: "Validation Error",
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: errors,
      },
    },
    { status: 422 }
  )
}

