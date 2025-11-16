"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label: string
    direction: "up" | "down" | "neutral"
  }
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs mt-2",
              trend.direction === "up" && "text-green-600",
              trend.direction === "down" && "text-red-600",
              trend.direction === "neutral" && "text-muted-foreground"
            )}
          >
            {trend.direction === "up" && <TrendingUp className="h-3 w-3" />}
            {trend.direction === "down" && <TrendingDown className="h-3 w-3" />}
            {trend.direction === "neutral" && <Minus className="h-3 w-3" />}
            <span>
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">vs {trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

