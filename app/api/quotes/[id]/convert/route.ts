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

    const dbUser = await ensureUserExists(user.id, user.email!)

    // Get quote
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, params.id))

    if (!quote) {
      return errorResponse("Quote not found", undefined, undefined, 404)
    }

    // Check ownership
    if (quote.agentId !== dbUser.id) {
      return errorResponse("Forbidden", undefined, undefined, 403)
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
    await logQuoteConverted(user.id, params.id, newCase.id)
    await logCaseCreated(user.id, newCase.id)

    return successResponse({
      case: newCase,
      quoteId: params.id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

