import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { contracts, users } from "@/db/schema"
import { checkPermission } from "@/lib/permissions"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canViewContracts = await checkPermission(user.id, "contracts", "read")
    if (!canViewContracts) {
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

    const allContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.agentId, dbUser.id))
      .orderBy(contracts.createdAt)

    return NextResponse.json(allContracts)
  } catch (error: any) {
    console.error("Error fetching contracts:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch contracts" },
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

    const canCreateContracts = await checkPermission(user.id, "contracts", "write")
    if (!canCreateContracts) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { carrier, commissionRate, notes } = body

    // Get user's database record
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const [newContract] = await db
      .insert(contracts)
      .values({
        carrier,
        agentId: dbUser.id,
        commissionRate: commissionRate ? commissionRate.toString() : null,
        notes,
        status: "pending",
      })
      .returning()

    return NextResponse.json(newContract, { status: 201 })
  } catch (error: any) {
    console.error("Error creating contract:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create contract" },
      { status: 500 }
    )
  }
}

