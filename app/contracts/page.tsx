import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { contracts, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ContractsPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canViewContracts = await checkPermission(authUser.id, "contracts", "read")
  if (!canViewContracts) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to view contracts.
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

  // Get all contracts for this user
  const allContracts = await db
    .select({
      id: contracts.id,
      contractNumber: contracts.contractNumber,
      carrier: contracts.carrier,
      commissionRate: contracts.commissionRate,
      status: contracts.status,
      effectiveDate: contracts.effectiveDate,
      createdAt: contracts.createdAt,
    })
    .from(contracts)
    .where(eq(contracts.agentId, dbUser.id))
    .orderBy(contracts.createdAt)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <Link href="/contracts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Request Contract
          </Button>
        </Link>
      </div>

      {allContracts.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground mb-4">No contracts yet.</p>
          <Link href="/contracts/new">
            <Button>Request Your First Contract</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Contract #</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Carrier</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Commission Rate</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Effective Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allContracts.map((contract) => (
                <tr key={contract.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{contract.contractNumber || "—"}</td>
                  <td className="p-4 align-middle">{contract.carrier}</td>
                  <td className="p-4 align-middle">
                    {contract.commissionRate ? `${contract.commissionRate}%` : "—"}
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contract.status)}`}
                    >
                      {contract.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {contract.effectiveDate
                      ? new Date(contract.effectiveDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4 align-middle">
                    {contract.createdAt
                      ? new Date(contract.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4 align-middle">
                    <Link href={`/contracts/${contract.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
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
