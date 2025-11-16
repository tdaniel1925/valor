import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, users } from "@/db/schema"
import { checkPermission } from "@/lib/permissions"
import { eq } from "drizzle-orm"
import { logCaseUpdated } from "@/lib/activity-log"

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canViewCases = await checkPermission(user.id, "cases", "read")
    if (!canViewCases) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [caseItem] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, params.id))
      .limit(1)

    if (!caseItem) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    return NextResponse.json(caseItem)
  } catch (error: any) {
    console.error("Error fetching case:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch case" },
      { status: 500 }
    )
  }
}

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canEditCases = await checkPermission(user.id, "cases", "write")
    if (!canEditCases) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { type, status, clientInfo, carrier, product, faceAmount, premium } = body

    // Get existing case to track changes
    const [existingCase] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, params.id))
      .limit(1)

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    const [updatedCase] = await db
      .update(cases)
      .set({
        type,
        status,
        clientInfo,
        carrier,
        product,
        faceAmount,
        premium,
        updatedAt: new Date(),
      })
      .where(eq(cases.id, params.id))
      .returning()

    // Log activity
    const changes: Record<string, any> = {}
    if (type !== existingCase.type) changes.type = { from: existingCase.type, to: type }
    if (status !== existingCase.status) changes.status = { from: existingCase.status, to: status }
    
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined
    const userAgent = request.headers.get("user-agent") || undefined
    await logCaseUpdated(user.id, params.id, changes, ipAddress, userAgent)

    return NextResponse.json(updatedCase)
  } catch (error: any) {
    console.error("Error updating case:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update case" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canDeleteCases = await checkPermission(user.id, "cases", "delete")
    if (!canDeleteCases) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.delete(cases).where(eq(cases.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting case:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete case" },
      { status: 500 }
    )
  }
}

