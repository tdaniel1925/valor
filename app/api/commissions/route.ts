import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { commissions, users } from "@/db/schema"
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

    const canViewCommissions = await checkPermission(user.id, "commissions", "read")
    if (!canViewCommissions) {
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

    const allCommissions = await db
      .select()
      .from(commissions)
      .where(eq(commissions.agentId, dbUser.id))
      .orderBy(commissions.createdAt)

    return NextResponse.json(allCommissions)
  } catch (error: any) {
    console.error("Error fetching commissions:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch commissions" },
      { status: 500 }
    )
  }
}

