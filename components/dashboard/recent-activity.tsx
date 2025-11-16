"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { formatDateTime } from "@/lib/utils/format"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface ActivityItem {
  id: string
  action: string
  description: string
  entityType: string
  createdAt: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activity?limit=5")
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("created")) return "➕"
    if (action.includes("updated")) return "✏️"
    if (action.includes("deleted")) return "🗑️"
    return "📝"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="text-lg">{getActionIcon(activity.action)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/reports/activity"
              className="text-sm text-primary hover:underline block text-center pt-2"
            >
              View all activity →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

