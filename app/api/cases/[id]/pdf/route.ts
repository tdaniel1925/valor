import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ensureUserExists } from "@/lib/user-helpers"
import { generateCasePDF } from "@/lib/pdf/pdf-generator"
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

    // Get case
    const [caseItem] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, params.id))

    if (!caseItem) {
      return notFoundResponse("Case not found")
    }

    // Check ownership
    if (caseItem.agentId !== dbUser.id) {
      return forbiddenResponse()
    }

    // Extract client data
    const clientInfo = caseItem.clientInfo as Record<string, any> || {}
    const clientName = clientInfo.name || clientInfo.firstName && clientInfo.lastName
      ? `${clientInfo.firstName} ${clientInfo.lastName}`
      : "Client"

    // Generate PDF
    const pdfBuffer = await generateCasePDF({
      caseNumber: caseItem.caseNumber || `CASE-${caseItem.id.slice(0, 6)}`,
      clientName: String(clientName),
      status: caseItem.status,
      carrier: caseItem.carrier || "N/A",
      product: caseItem.product || "N/A",
      submittedAt: caseItem.submittedAt
        ? new Date(caseItem.submittedAt).toLocaleDateString()
        : "N/A",
    })

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="case-${caseItem.caseNumber || caseItem.id}.pdf"`,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

