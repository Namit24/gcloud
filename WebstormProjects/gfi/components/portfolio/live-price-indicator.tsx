"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatPercentage } from "@/lib/portfolio-utils"

interface LivePriceIndicatorProps {
  symbol: string
  currentPrice: number
  change: number
  changePercentage: number
  isLive?: boolean
}

export function LivePriceIndicator({
  symbol,
  currentPrice,
  change,
  changePercentage,
  isLive = false,
}: LivePriceIndicatorProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (isLive) {
      setIsUpdating(true)
      const timer = setTimeout(() => setIsUpdating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [currentPrice, isLive])

  const getIcon = () => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    if (change < 0) return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getColor = () => {
    if (change > 0)
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
    if (change < 0) return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
    return "text-muted-foreground bg-muted border-border"
  }

  return (
    <div className={`flex items-center space-x-2 ${isUpdating ? "animate-pulse" : ""}`}>
      <span className="text-xs font-semibold">{formatCurrency(currentPrice)}</span>
      <Badge variant="outline" className={`text-xs px-2 py-0 border ${getColor()}`}>
        <div className="flex items-center space-x-1">
          {getIcon()}
          <span>{formatCurrency(Math.abs(change))}</span>
          <span>({formatPercentage(changePercentage)})</span>
        </div>
      </Badge>
      {isLive && (
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      )}
    </div>
  )
}
