import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases } from "@/db/schema"
import { inArray, eq } from "drizzle-orm"
import { ensureUserExists } from "@/lib/user-helpers"
import { logCaseUpdated } from "@/lib/activity-log"
import { successResponse, unauthorizedResponse, errorResponse, notFoundResponse } from "@/lib/api/response"
import { handleApiError } from "@/lib/api/error-handler"
import { processBatch } from "@/lib/utils/batch-helpers"

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    const dbUser = await ensureUserExists(user.id, user.email!)
    const { caseIds, updates } = await request.json()

    if (!caseIds || !Array.isArray(caseIds) || caseIds.length === 0) {
      return errorResponse("Bad Request", "caseIds array is required", undefined, 400)
    }

    if (!updates || typeof updates !== "object") {
      return errorResponse("Bad Request", "updates object is required", undefined, 400)
    }

    // Validate all cases belong to user
    const userCases = await db
      .select({ id: cases.id })
      .from(cases)
      .where(eq(cases.agentId, dbUser.id))

    const validCaseIds = userCases
      .map((c) => c.id)
      .filter((id) => caseIds.includes(id))

    if (validCaseIds.length === 0) {
      return notFoundResponse("No valid cases found")
    }

    // Process updates in batches
    const results = await processBatch(
      validCaseIds,
      async (caseId) => {
        const [updated] = await db
          .update(cases)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(eq(cases.id, caseId))
          .returning()

        // Log activity
        await logCaseUpdated(user.id, caseId, {
          bulkUpdate: true,
          updates,
        })

        return updated
      },
      10 // Process 10 at a time
    )

    return successResponse({
      updated: results.length,
      cases: results,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    const dbUser = await ensureUserExists(user.id, user.email!)
    const { caseIds } = await request.json()

    if (!caseIds || !Array.isArray(caseIds) || caseIds.length === 0) {
      return errorResponse("Bad Request", "caseIds array is required", undefined, 400)
    }

    // Validate all cases belong to user
    const userCases = await db
      .select({ id: cases.id })
      .from(cases)
      .where(eq(cases.agentId, dbUser.id))

    const validCaseIds = userCases
      .map((c) => c.id)
      .filter((id) => caseIds.includes(id))

    if (validCaseIds.length === 0) {
      return notFoundResponse("No valid cases found")
    }

    // Delete cases in batches
    await processBatch(
      validCaseIds,
      async (caseId) => {
        await db.delete(cases).where(eq(cases.id, caseId))
      },
      10
    )

    return successResponse({
      deleted: validCaseIds.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

