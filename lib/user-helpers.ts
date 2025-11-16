// Helper functions for user operations
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserBySupabaseId(supabaseAuthId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.supabaseAuthId, supabaseAuthId))
    .limit(1)

  return user || null
}

export async function ensureUserExists(supabaseAuthId: string, email: string) {
  const existingUser = await getUserBySupabaseId(supabaseAuthId)
  
  if (existingUser) {
    return existingUser
  }

  // Create user if doesn't exist
  const [newUser] = await db
    .insert(users)
    .values({
      supabaseAuthId,
      email,
    })
    .returning()

  return newUser
}

