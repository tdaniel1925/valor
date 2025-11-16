// Centralized API error handling

import { NextResponse } from "next/server"
import { errorResponse, serverErrorResponse } from "./response"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return errorResponse(
      error.message,
      error.message,
      error.code,
      error.statusCode
    )
  }

  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes("Unauthorized")) {
      return errorResponse("Unauthorized", error.message, "UNAUTHORIZED", 401)
    }

    if (error.message.includes("Forbidden")) {
      return errorResponse("Forbidden", error.message, "FORBIDDEN", 403)
    }

    if (error.message.includes("Not Found")) {
      return errorResponse("Not Found", error.message, "NOT_FOUND", 404)
    }

    // Database errors
    if (error.message.includes("duplicate key")) {
      return errorResponse(
        "Duplicate Entry",
        "A record with this value already exists",
        "DUPLICATE_KEY",
        409
      )
    }

    if (error.message.includes("foreign key")) {
      return errorResponse(
        "Invalid Reference",
        "Referenced record does not exist",
        "FOREIGN_KEY_ERROR",
        400
      )
    }
  }

  // Unknown error
  return serverErrorResponse(
    process.env.NODE_ENV === "development"
      ? String(error)
      : "An unexpected error occurred"
  )
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler()
    return result
  } catch (error) {
    return handleApiError(error)
  }
}

