import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { contracts, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canViewContracts = await checkPermission(authUser.id, "contracts", "read")
  if (!canViewContracts) {
    redirect("/contracts")
  }

  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, id))
    .limit(1)

  if (!contract) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Contract not found</h1>
        <Link href="/contracts">
          <Button variant="outline" className="mt-4">Back to Contracts</Button>
        </Link>
      </div>
    )
  }

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
        <div>
          <h1 className="text-3xl font-bold">
            Contract {contract.contractNumber || contract.id.substring(0, 8)}
          </h1>
          <p className="text-muted-foreground">{contract.carrier}</p>
        </div>
        <Link href="/contracts">
          <Button variant="outline">Back to Contracts</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Carrier</dt>
                <dd className="text-sm">{contract.carrier}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contract.status)}`}
                  >
                    {contract.status.replace("_", " ")}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Commission Rate</dt>
                <dd className="text-sm">
                  {contract.commissionRate ? `${contract.commissionRate}%` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Effective Date</dt>
                <dd className="text-sm">
                  {contract.effectiveDate
                    ? new Date(contract.effectiveDate).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Expiration Date</dt>
                <dd className="text-sm">
                  {contract.expirationDate
                    ? new Date(contract.expirationDate).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {contract.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{contract.notes}</p>
            </CardContent>
          </Card>
        )}

        {contract.documentUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Contract Document</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={contract.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Contract Document
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

