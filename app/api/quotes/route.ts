import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes, users } from "@/db/schema"
import { checkPermission } from "@/lib/permissions"
import { eq } from "drizzle-orm"
import { logQuoteCreated } from "@/lib/activity-log"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canViewQuotes = await checkPermission(user.id, "quotes", "read")
    if (!canViewQuotes) {
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

    const allQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.agentId, dbUser.id))
      .orderBy(quotes.createdAt)

    return NextResponse.json(allQuotes)
  } catch (error: any) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch quotes" },
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

    const canCreateQuotes = await checkPermission(user.id, "quotes", "write")
    if (!canCreateQuotes) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { type, carrier, product, faceAmount, premium, clientData } = body

    // Get user's database record
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const [newQuote] = await db
      .insert(quotes)
      .values({
        type,
        agentId: dbUser.id,
        carrier,
        product,
        faceAmount,
        premium,
        clientData,
      })
      .returning()

    // Log activity
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined
    const userAgent = request.headers.get("user-agent") || undefined
    await logQuoteCreated(user.id, newQuote.id, newQuote.quoteNumber || null, ipAddress, userAgent)

    return NextResponse.json(newQuote, { status: 201 })
  } catch (error: any) {
    console.error("Error creating quote:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create quote" },
      { status: 500 }
    )
  }
}
