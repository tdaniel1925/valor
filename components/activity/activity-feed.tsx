"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils/format"
import { Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityItem {
  id: string
  action: string
  entityType: string
  description: string
  createdAt: string
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  }
}

interface ActivityFeedProps {
  entityType?: string
  entityId?: string
  limit?: number
}

export function ActivityFeed({ entityType, entityId, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [entityType, entityId])

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams()
      if (entityType) params.append("entityType", entityType)
      if (entityId) params.append("entityId", entityId)
      if (limit) params.append("limit", limit.toString())

      const response = await fetch(`/api/activity?${params.toString()}`)
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Feed
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
          Activity Feed
        </CardTitle>
        <CardDescription>Recent activity and changes</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity to display
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">
                      {activity.user.firstName || activity.user.lastName
                        ? `${activity.user.firstName || ""} ${activity.user.lastName || ""}`.trim()
                        : activity.user.email}
                    </span>{" "}
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

