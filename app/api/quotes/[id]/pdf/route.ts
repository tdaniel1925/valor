import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ensureUserExists } from "@/lib/user-helpers"
import { generateQuotePDF } from "@/lib/pdf/pdf-generator"
import { unauthorizedResponse, notFoundResponse, forbiddenResponse } from "@/lib/api/response"
import { handleApiError } from "@/lib/api/error-handler"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    const dbUser = await ensureUserExists(user.id, user.email!)

    // Get quote
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, params.id))

    if (!quote) {
      return notFoundResponse("Quote not found")
    }

    // Check ownership
    if (quote.agentId !== dbUser.id) {
      return forbiddenResponse()
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

    // Return PDF - convert Buffer to Uint8Array for NextResponse
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quote-${quote.quoteNumber || quote.id}.pdf"`,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

