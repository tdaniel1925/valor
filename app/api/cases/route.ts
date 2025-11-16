import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, users } from "@/db/schema"
import { checkPermission } from "@/lib/permissions"
import { eq } from "drizzle-orm"
import { logCaseCreated } from "@/lib/activity-log"

export async function GET(request: NextRequest) {
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

    // Get user's database record
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const allCases = await db
      .select()
      .from(cases)
      .where(eq(cases.agentId, dbUser.id))
      .orderBy(cases.createdAt)

    return NextResponse.json(allCases)
  } catch (error: any) {
    console.error("Error fetching cases:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch cases" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canCreateCases = await checkPermission(user.id, "cases", "write")
    if (!canCreateCases) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { type, status, clientInfo, carrier, product, faceAmount, premium } = body

    // Get user's database record
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const [newCase] = await db
      .insert(cases)
      .values({
        type,
        status: status || "draft",
        agentId: dbUser.id,
        clientInfo,
        carrier,
        product,
        faceAmount,
        premium,
      })
      .returning()

    // Log activity
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined
    const userAgent = request.headers.get("user-agent") || undefined
    await logCaseCreated(user.id, newCase.id, newCase.caseNumber || null, ipAddress, userAgent)

    return NextResponse.json(newCase, { status: 201 })
  } catch (error: any) {
    console.error("Error creating case:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create case" },
      { status: 500 }
    )
  }
}

