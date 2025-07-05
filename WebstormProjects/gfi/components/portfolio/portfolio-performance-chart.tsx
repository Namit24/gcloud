"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency, formatPercentage } from "@/lib/portfolio-utils"
import type { PortfolioHistoryPoint, TimePeriod } from "@/types/portfolio"

interface PortfolioPerformanceChartProps {
  data: PortfolioHistoryPoint[]
  isLoading?: boolean
}

export function PortfolioPerformanceChart({ data, isLoading = false }: PortfolioPerformanceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M")

  const periods: { label: string; value: TimePeriod; days: number }[] = [
    { label: "1D", value: "1D", days: 1 },
    { label: "1W", value: "1W", days: 7 },
    { label: "1M", value: "1M", days: 30 },
    { label: "3M", value: "3M", days: 90 },
    { label: "1Y", value: "1Y", days: 365 },
  ]

  const getFilteredData = () => {
    const selectedDays = periods.find((p) => p.value === selectedPeriod)?.days || 30
    return data.slice(-selectedDays)
  }

  const filteredData = getFilteredData()
  const latestPoint = filteredData[filteredData.length - 1]
  const firstPoint = filteredData[0]
  const periodChange = latestPoint && firstPoint ? latestPoint.value - firstPoint.value : 0
  const periodChangePercentage =
    latestPoint && firstPoint && firstPoint.value > 0
      ? ((latestPoint.value - firstPoint.value) / firstPoint.value) * 100
      : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="text-xs text-muted-foreground">{new Date(label).toLocaleDateString()}</p>
          <p className="text-xs font-semibold">Value: {formatCurrency(data.value)}</p>
          <p className={`text-xs ${data.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            P&L: {formatCurrency(data.pnl)} ({formatPercentage(data.pnlPercentage)})
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            {latestPoint && (
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-2xl font-bold">{formatCurrency(latestPoint.value)}</span>
                <span className={`text-sm ${periodChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(periodChange)} ({formatPercentage(periodChangePercentage)})
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className="text-xs px-3 py-1"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
