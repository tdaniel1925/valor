import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExportButton } from "@/components/export/export-button"

export default async function CasesPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canViewCases = await checkPermission(authUser.id, "cases", "read")
  if (!canViewCases) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to view cases.
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

  // Get all cases for this user
  const allCases = await db
    .select({
      id: cases.id,
      caseNumber: cases.caseNumber,
      type: cases.type,
      status: cases.status,
      carrier: cases.carrier,
      product: cases.product,
      createdAt: cases.createdAt,
    })
    .from(cases)
    .where(eq(cases.agentId, dbUser.id))
    .orderBy(cases.createdAt)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending_requirements: "bg-orange-100 text-orange-800",
      issued: "bg-purple-100 text-purple-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cases</h1>
        <div className="flex gap-2">
          {allCases.length > 0 && (
            <ExportButton
              data={allCases.map((c) => ({
                "Case #": c.caseNumber || c.id.substring(0, 8),
                Type: c.type,
                Status: c.status,
                Carrier: c.carrier || "",
                Product: c.product || "",
                Created: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "",
              }))}
              filename="cases"
              headers={{
                "Case #": "Case Number",
                Type: "Type",
                Status: "Status",
                Carrier: "Carrier",
                Product: "Product",
                Created: "Created Date",
              }}
            />
          )}
          <Link href="/cases/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </Link>
        </div>
      </div>

      {allCases.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground mb-4">No cases yet.</p>
          <Link href="/cases/new">
            <Button>Create Your First Case</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Case #</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Carrier</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{caseItem.caseNumber || "—"}</td>
                  <td className="p-4 align-middle capitalize">{caseItem.type}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(caseItem.status)}`}
                    >
                      {caseItem.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{caseItem.carrier || "—"}</td>
                  <td className="p-4 align-middle">{caseItem.product || "—"}</td>
                  <td className="p-4 align-middle">
                    {caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4 align-middle">
                    <Link href={`/cases/${caseItem.id}`}>
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

