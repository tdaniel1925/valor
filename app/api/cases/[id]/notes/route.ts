import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { notes, users, cases } from "@/db/schema"
import { checkPermission } from "@/lib/permissions"
import { eq } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get notes with user information
    const allNotes = await db
      .select({
        id: notes.id,
        content: notes.content,
        isInternal: notes.isInternal,
        createdAt: notes.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
      })
      .from(notes)
      .innerJoin(users, eq(notes.userId, users.id))
      .where(eq(notes.caseId, params.id))
      .orderBy(notes.createdAt)

    return NextResponse.json(allNotes)
  } catch (error: any) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canEditCases = await checkPermission(user.id, "cases", "write")
    if (!canEditCases) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Verify case exists
    const [caseItem] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, params.id))
      .limit(1)

    if (!caseItem) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    const body = await request.json()
    const { content, isInternal } = body

    // Get user's database record
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const [newNote] = await db
      .insert(notes)
      .values({
        caseId: params.id,
        userId: dbUser.id,
        content,
        isInternal: isInternal || false,
      })
      .returning()

    return NextResponse.json(newNote, { status: 201 })
  } catch (error: any) {
    console.error("Error creating note:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create note" },
      { status: 500 }
    )
  }
}

