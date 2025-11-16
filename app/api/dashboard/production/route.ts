import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, commissions } from "@/db/schema"
import { eq, and, gte, sql } from "drizzle-orm"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's database record
    const { getUserBySupabaseId, ensureUserExists } = await import("@/lib/user-helpers")
    let dbUser = await getUserBySupabaseId(user.id)

    if (!dbUser) {
      // Create user if doesn't exist
      const createdUser = await ensureUserExists(user.id, user.email || "")
      if (!createdUser) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }
      dbUser = createdUser
    }

    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const quarterStart = new Date(
      now.getFullYear(),
      Math.floor(now.getMonth() / 3) * 3,
      1
    )

    // YTD metrics
    const ytdCases = await db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(
        and(
          eq(cases.agentId, dbUser.id),
          gte(cases.createdAt, yearStart)
        )
      )

    const ytdCommissions = await db
      .select({ total: sql<number>`sum(${commissions.amount})` })
      .from(commissions)
      .where(
        and(
          eq(commissions.agentId, dbUser.id),
          gte(commissions.createdAt, yearStart)
        )
      )

    // MTD metrics
    const mtdCases = await db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(
        and(
          eq(cases.agentId, dbUser.id),
          gte(cases.createdAt, monthStart)
        )
      )

    const mtdCommissions = await db
      .select({ total: sql<number>`sum(${commissions.amount})` })
      .from(commissions)
      .where(
        and(
          eq(commissions.agentId, dbUser.id),
          gte(commissions.createdAt, monthStart)
        )
      )

    // QTD metrics
    const qtdCases = await db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(
        and(
          eq(cases.agentId, dbUser.id),
          gte(cases.createdAt, quarterStart)
        )
      )

    const qtdCommissions = await db
      .select({ total: sql<number>`sum(${commissions.amount})` })
      .from(commissions)
      .where(
        and(
          eq(commissions.agentId, dbUser.id),
          gte(commissions.createdAt, quarterStart)
        )
      )

    return NextResponse.json({
      ytd: {
        cases: Number(ytdCases[0]?.count || 0),
        premium: 0, // Calculate from cases if needed
        commissions: Number(ytdCommissions[0]?.total || 0),
      },
      mtd: {
        cases: Number(mtdCases[0]?.count || 0),
        premium: 0,
        commissions: Number(mtdCommissions[0]?.total || 0),
      },
      qtd: {
        cases: Number(qtdCases[0]?.count || 0),
        premium: 0,
        commissions: Number(qtdCommissions[0]?.total || 0),
      },
    })
  } catch (error: any) {
    console.error("Error fetching production metrics:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch metrics" },
      { status: 500 }
    )
  }
}

