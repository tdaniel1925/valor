import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases } from "@/db/schema"
import { eq } from "drizzle-orm"
import { logCaseUpdated } from "@/lib/activity-log"
import { createSuccessResponse, createErrorResponse } from "@/lib/api/response"
import { handleApiError } from "@/lib/api/error-handler"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return createErrorResponse("Unauthorized", 401)
    }

    const { status } = await request.json()

    if (!status) {
      return createErrorResponse("Status is required", 400)
    }

    // Validate status
    const validStatuses = [
      "draft",
      "submitted",
      "under_review",
      "approved",
      "rejected",
      "pending_requirements",
      "issued",
    ]

    if (!validStatuses.includes(status)) {
      return createErrorResponse("Invalid status", 400)
    }

    // Update case status
    const [updatedCase] = await db
      .update(cases)
      .set({
        status: status as any,
        updatedAt: new Date(),
      })
      .where(eq(cases.id, params.id))
      .returning()

    if (!updatedCase) {
      return createErrorResponse("Case not found", 404)
    }

    // Log activity
    await logCaseUpdated(user.id, params.id, {
      statusChanged: true,
      newStatus: status,
    })

    return createSuccessResponse(updatedCase)
  } catch (error) {
    return handleApiError(error)
  }
}

