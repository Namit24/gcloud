"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/portfolio-utils"
import type { PortfolioSummary } from "@/types/portfolio"

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary
  isLoading?: boolean
}

export function PortfolioSummaryCards({ summary, isLoading = false }: PortfolioSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3">
              <div className="h-2 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Portfolio Value",
      value: formatCurrency(summary.totalValue),
      icon: PieChart,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total P&L",
      value: formatCurrency(summary.totalPnl),
      subtitle: formatPercentage(summary.totalPnlPercentage),
      icon: summary.totalPnl >= 0 ? TrendingUp : TrendingDown,
      color: summary.totalPnl >= 0 ? "text-emerald-600" : "text-red-600",
      bgColor: summary.totalPnl >= 0 ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "Day's P&L",
      value: formatCurrency(summary.daysPnl),
      subtitle: formatPercentage(summary.daysPnlPercentage),
      icon: summary.daysPnl >= 0 ? TrendingUp : TrendingDown,
      color: summary.daysPnl >= 0 ? "text-emerald-600" : "text-red-600",
      bgColor: summary.daysPnl >= 0 ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "Total Holdings",
      value: summary.holdings.length.toString(),
      subtitle: "Active positions",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
                <p className={`text-base font-bold ${card.color}`}>{card.value}</p>
                {card.subtitle && (
                  <Badge variant="secondary" className={`text-xs mt-1 ${card.color} ${card.bgColor} border-0`}>
                    {card.subtitle}
                  </Badge>
                )}
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
