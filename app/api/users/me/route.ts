import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(dbUser)
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone } = body

    const [updatedUser] = await db
      .update(users)
      .set({
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        updatedAt: new Date(),
      })
      .where(eq(users.supabaseAuthId, user.id))
      .returning()

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    )
  }
}

