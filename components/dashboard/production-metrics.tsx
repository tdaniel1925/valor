"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductionMetrics {
  ytd: {
    cases: number
    premium: number
    commissions: number
  }
  mtd: {
    cases: number
    premium: number
    commissions: number
  }
  qtd: {
    cases: number
    premium: number
    commissions: number
  }
}

export function ProductionMetrics() {
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/dashboard/production")
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Failed to fetch production metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return <div>Loading metrics...</div>
  }

  if (!metrics) {
    return <div>No metrics available</div>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Year to Date</CardTitle>
          <CardDescription>2024 Production</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-2xl font-bold">{metrics.ytd.cases}</div>
              <div className="text-sm text-muted-foreground">Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.ytd.premium)}</div>
              <div className="text-sm text-muted-foreground">Premium</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.ytd.commissions)}</div>
              <div className="text-sm text-muted-foreground">Commissions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Month to Date</CardTitle>
          <CardDescription>Current Month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-2xl font-bold">{metrics.mtd.cases}</div>
              <div className="text-sm text-muted-foreground">Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.mtd.premium)}</div>
              <div className="text-sm text-muted-foreground">Premium</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.mtd.commissions)}</div>
              <div className="text-sm text-muted-foreground">Commissions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quarter to Date</CardTitle>
          <CardDescription>Current Quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-2xl font-bold">{metrics.qtd.cases}</div>
              <div className="text-sm text-muted-foreground">Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.qtd.premium)}</div>
              <div className="text-sm text-muted-foreground">Premium</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.qtd.commissions)}</div>
              <div className="text-sm text-muted-foreground">Commissions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

