import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ensureUserExists } from "@/lib/user-helpers"
import { logQuoteCreated } from "@/lib/activity-log"
import { successResponse, errorResponse } from "@/lib/api/response"
import { handleApiError } from "@/lib/api/error-handler"
import { processBatch } from "@/lib/utils/batch-helpers"

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return errorResponse("Unauthorized", "Unauthorized access", "UNAUTHORIZED", 401)
    }

    const dbUser = await ensureUserExists(user.id, user.email!)
    const { quoteIds, updates } = await request.json()

    if (!quoteIds || !Array.isArray(quoteIds) || quoteIds.length === 0) {
      return errorResponse("Bad Request", "quoteIds array is required", "BAD_REQUEST", 400)
    }

    if (!updates || typeof updates !== "object") {
      return errorResponse("Bad Request", "updates object is required", "BAD_REQUEST", 400)
    }

    // Validate all quotes belong to user
    const userQuotes = await db
      .select({ id: quotes.id })
      .from(quotes)
      .where(eq(quotes.agentId, dbUser.id))

    const validQuoteIds = userQuotes
      .map((q) => q.id)
      .filter((id) => quoteIds.includes(id))

    if (validQuoteIds.length === 0) {
      return errorResponse("Not Found", "No valid quotes found", "NOT_FOUND", 404)
    }

    // Process updates in batches
    const results = await processBatch(
      validQuoteIds,
      async (quoteId) => {
        const [updated] = await db
          .update(quotes)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(eq(quotes.id, quoteId))
          .returning()

        return updated
      },
      10
    )

    return successResponse({
      updated: results.length,
      quotes: results,
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
      return errorResponse("Unauthorized", "Unauthorized access", "UNAUTHORIZED", 401)
    }

    const dbUser = await ensureUserExists(user.id, user.email!)
    const { quoteIds } = await request.json()

    if (!quoteIds || !Array.isArray(quoteIds) || quoteIds.length === 0) {
      return errorResponse("Bad Request", "quoteIds array is required", "BAD_REQUEST", 400)
    }

    // Validate all quotes belong to user
    const userQuotes = await db
      .select({ id: quotes.id })
      .from(quotes)
      .where(eq(quotes.agentId, dbUser.id))

    const validQuoteIds = userQuotes
      .map((q) => q.id)
      .filter((id) => quoteIds.includes(id))

    if (validQuoteIds.length === 0) {
      return errorResponse("Not Found", "No valid quotes found", "NOT_FOUND", 404)
    }

    // Delete quotes in batches
    await processBatch(
      validQuoteIds,
      async (quoteId) => {
        await db.delete(quotes).where(eq(quotes.id, quoteId))
      },
      10
    )

    return successResponse({
      deleted: validQuoteIds.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

