import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ensureUserExists } from "@/lib/user-helpers"
import { generateQuotePDF } from "@/lib/pdf/pdf-generator"
import { successResponse, errorResponse } from "@/lib/api/response"
import { handleApiError } from "@/lib/api/error-handler"

export async function GET(
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

    // Extract client data
    const clientData = quote.clientData as Record<string, any> || {}
    const clientName = clientData.name || clientData.firstName && clientData.lastName
      ? `${clientData.firstName} ${clientData.lastName}`
      : "Client"

    // Generate PDF
    const pdfBuffer = await generateQuotePDF({
      quoteNumber: quote.quoteNumber || `QUOTE-${quote.id.slice(0, 6)}`,
      clientName: String(clientName),
      carrier: quote.carrier || "N/A",
      product: quote.product || "N/A",
      faceAmount: quote.faceAmount || "N/A",
      premium: quote.premium || "N/A",
      effectiveDate: new Date(quote.createdAt).toLocaleDateString(),
    })

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quote-${quote.quoteNumber || quote.id}.pdf"`,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

