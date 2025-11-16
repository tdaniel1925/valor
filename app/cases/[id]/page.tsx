import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CaseNotes } from "@/components/cases/case-notes"

export default async function CaseDetailPage({
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

  const canViewCases = await checkPermission(authUser.id, "cases", "read")
  if (!canViewCases) {
    redirect("/cases")
  }

  const [caseItem] = await db
    .select()
    .from(cases)
    .where(eq(cases.id, id))
    .limit(1)

  if (!caseItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Case not found</h1>
        <Link href="/cases">
          <Button variant="outline" className="mt-4">Back to Cases</Button>
        </Link>
      </div>
    )
  }

  const clientInfo = caseItem.clientInfo as any
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
        <div>
          <h1 className="text-3xl font-bold">
            Case {caseItem.caseNumber || caseItem.id.substring(0, 8)}
          </h1>
          <p className="text-muted-foreground capitalize">{caseItem.type} Insurance Case</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/cases/${caseItem.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Link href="/cases">
            <Button variant="outline">Back to Cases</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{clientInfo?.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{clientInfo?.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{clientInfo?.phone || "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(caseItem.status)}`}
                  >
                    {caseItem.status.replace("_", " ")}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Carrier</dt>
                <dd className="text-sm">{caseItem.carrier || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Product</dt>
                <dd className="text-sm">{caseItem.product || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Face Amount</dt>
                <dd className="text-sm">{caseItem.faceAmount || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Premium</dt>
                <dd className="text-sm">{caseItem.premium || "—"}</dd>
              </div>
              {caseItem.submittedAt && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Submitted</dt>
                  <dd className="text-sm">
                    {new Date(caseItem.submittedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      <CaseNotes caseId={caseItem.id} />
    </div>
  )
}

