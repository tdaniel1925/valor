import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supabaseAuthId, email } = body

    if (!supabaseAuthId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, supabaseAuthId))
      .limit(1)

    // Create user if they don't exist
    if (existingUser.length === 0) {
      await db.insert(users).values({
        supabaseAuthId,
        email,
        firstName: "",
        lastName: "",
        isActive: true,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error syncing user:", error)
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    )
  }
}
