import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { activityLogs, users } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Note: All authenticated users can view activity logs
    // Add permission check here if you need to restrict access later

    const searchParams = request.nextUrl.searchParams
    const entityType = searchParams.get("entityType")
    const entityId = searchParams.get("entityId")
    const limit = parseInt(searchParams.get("limit") || "50")

    // Build query
    let query = db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        entityType: activityLogs.entityType,
        description: activityLogs.description,
        createdAt: activityLogs.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
      })
      .from(activityLogs)
      .innerJoin(users, eq(activityLogs.userId, users.id))

    // Apply filters
    const conditions = []
    if (entityType) {
      conditions.push(eq(activityLogs.entityType, entityType))
    }
    if (entityId) {
      conditions.push(eq(activityLogs.entityId, entityId))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any
    }

    const activities = await query
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit)

    return NextResponse.json(activities)
  } catch (error: any) {
    console.error("Error fetching activity:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch activity" },
      { status: 500 }
    )
  }
}

