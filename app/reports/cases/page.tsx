import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CaseReportsPage() {
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
          <h1 className="text-3xl font-bold">Case Reports</h1>
          <p className="mt-2 text-muted-foreground">
            Analyze case status, types, and submission trends.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Analytics</CardTitle>
          <CardDescription>
            Detailed case reports with status breakdowns and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed case reports with charts and analytics coming soon.
            For now, view your cases on the{" "}
            <Link href="/cases" className="text-primary hover:underline">
              cases page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

