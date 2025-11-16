import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, BarChart3, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function ReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const canViewReports = await checkPermission(user.id, "reports", "read")
  if (!canViewReports) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have permission to view reports.
        </p>
      </div>
    )
  }

  const reportTypes = [
    {
      id: "production",
      title: "Production Reports",
      description: "View production metrics, case statistics, and performance data",
      icon: BarChart3,
      href: "/reports/production",
    },
    {
      id: "commissions",
      title: "Commission Reports",
      description: "Track commissions, payments, and earnings over time",
      icon: DollarSign,
      href: "/reports/commissions",
    },
    {
      id: "cases",
      title: "Case Reports",
      description: "Analyze case status, types, and submission trends",
      icon: FileText,
      href: "/reports/cases",
    },
    {
      id: "trends",
      title: "Trend Analysis",
      description: "View trends and patterns in your business metrics",
      icon: TrendingUp,
      href: "/reports/trends",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Generate and view detailed reports on your business performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <Link key={report.id} href={report.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>
            Create custom reports with drag-and-drop report builder (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The custom report builder will allow you to create personalized reports
            with the metrics and data that matter most to you.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
