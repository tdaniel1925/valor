"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stat {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: "up" | "down" | "neutral"
}

interface StatsWidgetProps {
  title: string
  description?: string
  stats: Stat[]
  className?: string
}

export function StatsWidget({ title, description, stats, className }: StatsWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.change !== undefined && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      stat.trend === "up" && "text-green-600",
                      stat.trend === "down" && "text-red-600",
                      stat.trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {stat.trend === "up" && <TrendingUp className="h-4 w-4" />}
                    {stat.trend === "down" && <TrendingDown className="h-4 w-4" />}
                    {stat.trend === "neutral" && <Minus className="h-4 w-4" />}
                    <span>
                      {stat.change > 0 ? "+" : ""}
                      {stat.change}%
                    </span>
                    {stat.changeLabel && (
                      <span className="text-muted-foreground">vs {stat.changeLabel}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

