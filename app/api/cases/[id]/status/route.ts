import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases } from "@/db/schema"
import { eq } from "drizzle-orm"
import { logCaseUpdated } from "@/lib/activity-log"
import { successResponse, errorResponse } from "@/lib/api/response"
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
      return errorResponse("Unauthorized", undefined, undefined, 401)
    }

    const { status } = await request.json()

    if (!status) {
      return errorResponse("Status is required", undefined, undefined, 400)
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
      return errorResponse("Invalid status", undefined, undefined, 400)
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
      return errorResponse("Case not found", undefined, undefined, 404)
    }

    // Log activity
    await logCaseUpdated(user.id, params.id, {
      statusChanged: true,
      newStatus: status,
    })

    return successResponse(updatedCase)
  } catch (error) {
    return handleApiError(error)
  }
}

