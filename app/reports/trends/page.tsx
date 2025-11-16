import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function TrendsReportsPage() {
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
          <h1 className="text-3xl font-bold">Trend Analysis</h1>
          <p className="mt-2 text-muted-foreground">
            View trends and patterns in your business metrics.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Analytics</CardTitle>
          <CardDescription>
            Analyze trends and patterns across production, commissions, and cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Trend analysis reports with interactive charts coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

