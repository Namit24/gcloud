"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/portfolio-utils"
import type { PortfolioHolding } from "@/types/portfolio"

interface TopHoldingsChartProps {
  holdings: PortfolioHolding[]
  isLoading?: boolean
}

export function TopHoldingsChart({ holdings, isLoading = false }: TopHoldingsChartProps) {
  const topHoldings = holdings.slice(0, 10) // Top 10 holdings

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.companyName}</p>
          <p className="text-xs">Symbol: {data.symbol}</p>
          <p className="text-xs">Value: {formatCurrency(data.marketValue)}</p>
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
          <CardTitle>Top Holdings</CardTitle>
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
        <CardTitle>Top Holdings Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHoldings} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="symbol" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="marketValue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings List */}
        <div className="mt-4 space-y-2">
          {topHoldings.slice(0, 5).map((holding, index) => (
            <div key={holding.symbol} className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                <div>
                  <p className="text-xs font-semibold">{holding.symbol}</p>
                  <p className="text-xs text-muted-foreground">{holding.companyName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">{formatCurrency(holding.marketValue)}</p>
                <div className="flex items-center space-x-1">
                  {holding.pnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${holding.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {formatPercentage(holding.pnlPercentage)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
