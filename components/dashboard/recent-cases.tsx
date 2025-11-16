"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { subscribeToTable, unsubscribe } from "@/lib/supabase/realtime"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface Case {
  id: string
  caseNumber: string | null
  type: string
  status: string
  createdAt: string
}

export function RecentCases() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCases() {
      try {
        const response = await fetch("/api/cases")
        if (response.ok) {
          const data = await response.json()
          setCases(data.slice(0, 5))
        }
      } catch (error) {
        console.error("Failed to fetch cases:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()

    // Subscribe to real-time updates
    const channel = subscribeToTable("cases", (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        fetchCases() // Refresh cases on change
      }
    })

    return () => {
      unsubscribe(channel)
    }
  }, [])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  if (cases.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No recent cases. <Link href="/cases/new" className="text-primary hover:underline">Create your first case</Link>
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {cases.map((caseItem) => (
        <Link
          key={caseItem.id}
          href={`/cases/${caseItem.id}`}
          className="block p-2 rounded hover:bg-muted transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {caseItem.caseNumber || caseItem.id.substring(0, 8)}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {caseItem.type} • {caseItem.status.replace("_", " ")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(caseItem.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
      <Link href="/cases" className="text-sm text-primary hover:underline mt-2 block">
        View all cases →
      </Link>
    </div>
  )
}

