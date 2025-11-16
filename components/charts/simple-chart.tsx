"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

interface SimpleChartProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  type?: "line" | "bar"
  dataKeys: string[]
  colors?: string[]
  height?: number
}

export function SimpleChart({
  title,
  description,
  data,
  type = "line",
  dataKeys,
  colors = ["#8884d8", "#82ca9d", "#ffc658"],
  height = 300,
}: SimpleChartProps) {
  const ChartComponent = type === "line" ? LineChart : BarChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => {
              const ChartElement = type === "line" ? Line : Bar
              return (
                <ChartElement
                  key={key}
                  type={type === "line" ? "monotone" : undefined}
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                />
              )
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

