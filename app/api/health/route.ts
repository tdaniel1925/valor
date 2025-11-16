import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { users } from "@/db/schema"
import { db } from "@/db"

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
      supabase: "unknown",
    },
  }

  try {
    // Check database connection by querying a simple table
    await db.select().from(users).limit(1)
    health.services.database = "connected"
  } catch (error) {
    health.services.database = "disconnected"
    health.status = "degraded"
  }

  try {
    // Check Supabase connection
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getSession()
    if (!error) {
      health.services.supabase = "connected"
    } else {
      health.services.supabase = "error"
      health.status = "degraded"
    }
  } catch (error) {
    health.services.supabase = "disconnected"
    health.status = "degraded"
  }

  const statusCode = health.status === "healthy" ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}

