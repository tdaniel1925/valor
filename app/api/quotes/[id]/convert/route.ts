import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes, cases } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ensureUserExists } from "@/lib/user-helpers"
import { logQuoteConverted, logCaseCreated } from "@/lib/activity-log"
import { successResponse, errorResponse } from "@/lib/api/response"
import { handleApiError } from "@/lib/api/error-handler"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return errorResponse("Unauthorized", 401)
    }

    const dbUser = await ensureUserExists(user.id, user.email!)

    // Get quote
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id))

    if (!quote) {
      return errorResponse("Quote not found", 404)
    }

    // Check ownership
    if (quote.agentId !== dbUser.id) {
      return errorResponse("Forbidden", 403)
    }

    // Create case from quote
    const [newCase] = await db
      .insert(cases)
      .values({
        type: quote.type,
        status: "draft",
        agentId: dbUser.id,
        clientInfo: quote.clientData || {},
        carrier: quote.carrier,
        product: quote.product,
        faceAmount: quote.faceAmount,
        premium: quote.premium,
      })
      .returning()

    // Log activities
    await logQuoteConverted(user.id, id, newCase.id)
    await logCaseCreated(user.id, newCase.id)

    return successResponse({
      case: newCase,
      quoteId: id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

