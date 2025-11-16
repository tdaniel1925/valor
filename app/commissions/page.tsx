import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { commissions, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CommissionsPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canViewCommissions = await checkPermission(authUser.id, "commissions", "read")
  if (!canViewCommissions) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have permission to view commissions.
        </p>
      </div>
    )
  }

  // Get user's database record
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.supabaseAuthId, authUser.id))
    .limit(1)

  if (!dbUser) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    )
  }

  // Get commissions
  const allCommissions = await db
    .select()
    .from(commissions)
    .where(eq(commissions.agentId, dbUser.id))
    .orderBy(commissions.createdAt)

  const pendingCommissions = allCommissions.filter(c => c.status === "pending")
  const paidCommissions = allCommissions.filter(c => c.status === "paid")

  const totalPending = pendingCommissions.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const totalPaid = paidCommissions.reduce((sum, c) => sum + Number(c.amount || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Commissions</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Commissions</CardTitle>
            <CardDescription>Awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalPending)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {pendingCommissions.length} commission{pendingCommissions.length !== 1 ? "s" : ""} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paid Commissions</CardTitle>
            <CardDescription>Total paid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {paidCommissions.length} commission{paidCommissions.length !== 1 ? "s" : ""} paid
            </p>
          </CardContent>
        </Card>
      </div>

      {allCommissions.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">No commissions yet.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Paid Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {allCommissions.map((commission) => (
                <tr key={commission.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">
                    {formatCurrency(Number(commission.amount || 0))}
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        commission.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : commission.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {commission.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{commission.period || "—"}</td>
                  <td className="p-4 align-middle">
                    {commission.paidAt
                      ? new Date(commission.paidAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4 align-middle">
                    {commission.createdAt
                      ? new Date(commission.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

