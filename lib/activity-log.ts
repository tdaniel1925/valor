// Activity logging utility
import { db } from "@/db"
import { activityLogs, users } from "@/db/schema"
import { eq } from "drizzle-orm"

interface LogActivityParams {
  userId: string // Supabase auth ID
  action: string
  entityType: string
  entityId?: string
  description: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function logActivity(params: LogActivityParams) {
  try {
    // Get user's database record
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, params.userId))
      .limit(1)

    if (!dbUser) {
      console.warn("User not found for activity log:", params.userId)
      return
    }

    await db.insert(activityLogs).values({
      userId: dbUser.id,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
      metadata: params.metadata || null,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    })
  } catch (error) {
    // Don't throw - logging should never break the app
    console.error("Failed to log activity:", error)
  }
}

// Helper functions for common actions
export async function logCaseCreated(
  userId: string,
  caseId: string,
  caseNumber?: string | null,
  ipAddress?: string,
  userAgent?: string
) {
  await logActivity({
    userId,
    action: "case.created",
    entityType: "case",
    entityId: caseId,
    description: `Case ${caseNumber || caseId.substring(0, 8)} was created`,
    metadata: { caseNumber },
    ipAddress,
    userAgent,
  })
}

export async function logCaseUpdated(
  userId: string,
  caseId: string,
  changes: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) {
  await logActivity({
    userId,
    action: "case.updated",
    entityType: "case",
    entityId: caseId,
    description: "Case was updated",
    metadata: { changes },
    ipAddress,
    userAgent,
  })
}

export async function logQuoteCreated(
  userId: string,
  quoteId: string,
  quoteNumber?: string | null,
  ipAddress?: string,
  userAgent?: string
) {
  await logActivity({
    userId,
    action: "quote.created",
    entityType: "quote",
    entityId: quoteId,
    description: `Quote ${quoteNumber || quoteId.substring(0, 8)} was created`,
    metadata: { quoteNumber },
    ipAddress,
    userAgent,
  })
}

export async function logQuoteConverted(
  userId: string,
  quoteId: string,
  caseId: string,
  ipAddress?: string,
  userAgent?: string
) {
  await logActivity({
    userId,
    action: "quote.converted",
    entityType: "quote",
    entityId: quoteId,
    description: `Quote was converted to case ${caseId.substring(0, 8)}`,
    metadata: { caseId },
    ipAddress,
    userAgent,
  })
}

