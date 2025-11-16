import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, quotes, commissions, users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { ProductionMetrics } from "@/components/dashboard/production-metrics"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  console.log("Dashboard - User:", user ? `Found: ${user.email}` : "Not found")
  console.log("Dashboard - Auth Error:", authError)

  if (!user) {
    console.log("Dashboard - Redirecting to login (no user)")
    redirect("/auth/login")
  }

  // Try to get user's database record (optional - for backward compatibility)
  let dbUser = null
  try {
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.supabaseAuthId, user.id))
      .limit(1)
    dbUser = foundUser
  } catch (error) {
    console.log("Database user not found, continuing with Supabase auth only")
  }

  // Get recent cases (only if user has a database record)
  const recentCases = dbUser ? await db
    .select({
      id: cases.id,
      caseNumber: cases.caseNumber,
      type: cases.type,
      status: cases.status,
      createdAt: cases.createdAt,
    })
    .from(cases)
    .where(eq(cases.agentId, dbUser.id))
    .orderBy(desc(cases.createdAt))
    .limit(5) : []

  // Get pending commissions (only if user has a database record)
  const pendingCommissions = dbUser ? await db
    .select()
    .from(commissions)
    .where(eq(commissions.agentId, dbUser.id))
    .limit(5) : []

  const totalPending = pendingCommissions
    .filter(c => c.status === "pending")
    .reduce((sum, c) => sum + Number(c.amount || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/quotes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Quote
            </Button>
          </Link>
          <Link href="/cases/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </Link>
        </div>
      </div>

      <ProductionMetrics />

      <QuickActions />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity />
        </div>
        <div className="md:col-span-1">
          {/* Placeholder for additional widget */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Your latest case submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCases.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent cases. <Link href="/cases/new" className="text-primary hover:underline">Create your first case</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {recentCases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/cases/${caseItem.id}`}
                    className="block p-2 rounded hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {caseItem.caseNumber || caseItem.id.substring(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {caseItem.type} • {caseItem.status.replace("_", " ")}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {caseItem.createdAt
                          ? new Date(caseItem.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </Link>
                ))}
                <Link href="/cases" className="text-sm text-primary hover:underline mt-2 block">
                  View all cases →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Commissions</CardTitle>
            <CardDescription>Commissions awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingCommissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending commissions.
              </p>
            ) : (
              <div>
                <div className="text-2xl font-bold mb-2">
                  {formatCurrency(totalPending)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {pendingCommissions.filter(c => c.status === "pending").length} pending
                </p>
                <Link href="/commissions" className="text-sm text-primary hover:underline mt-2 block">
                  View all commissions →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

