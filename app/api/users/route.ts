import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { checkPermission } from "@/lib/permissions"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canCreateUsers = await checkPermission(authUser.id, "users", "write")
    if (!canCreateUsers) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { supabaseAuthId, email, firstName, lastName, phone } = body

    const [newUser] = await db
      .insert(users)
      .values({
        supabaseAuthId,
        email,
        firstName,
        lastName,
        phone,
      })
      .returning()

    return NextResponse.json(newUser, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    )
  }
}

