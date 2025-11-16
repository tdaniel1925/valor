import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CommissionReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const canViewReports = await checkPermission(user.id, "reports", "read")
  if (!canViewReports) {
    redirect("/reports")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/reports">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Commission Reports</h1>
          <p className="mt-2 text-muted-foreground">
            Track commissions, payments, and earnings over time.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Analytics</CardTitle>
          <CardDescription>
            Detailed commission reports with trends and breakdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed commission reports with charts and analytics coming soon.
            For now, view your commissions on the{" "}
            <Link href="/commissions" className="text-primary hover:underline">
              commissions page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

