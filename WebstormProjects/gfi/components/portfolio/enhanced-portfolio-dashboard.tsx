"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Wifi, AlertCircle } from "lucide-react"
import { PortfolioSummaryCards } from "./portfolio-summary-cards"
import { PortfolioPerformanceChart } from "./portfolio-performance-chart"
import { SectorAllocationChart } from "./sector-allocation-chart"
import { TopHoldingsChart } from "./top-holdings-chart"
import { LivePriceIndicator } from "./live-price-indicator"
import { calculateSectorAllocation, getTopHoldings } from "@/lib/portfolio-utils"
import { convertUpstoxToPortfolioSummary, generatePortfolioHistoryFromUpstox } from "@/lib/upstox-portfolio-adapter"
import type { PortfolioSummary } from "@/types/portfolio"
import type { UpstoxHolding, UpstoxFunds, UpstoxProfile } from "@/types/upstox"

interface UpstoxPortfolioData {
  holdings: UpstoxHolding[]
  funds?: UpstoxFunds
  profile?: UpstoxProfile
  accessToken: string
  timestamp: string
}

interface EnhancedPortfolioDashboardProps {
  enableLiveData?: boolean
}

export function EnhancedPortfolioDashboard({ enableLiveData = false }: EnhancedPortfolioDashboardProps) {
  const [portfolioData, setPortfolioData] = useState<UpstoxPortfolioData | null>(null)
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Load Upstox portfolio data from sessionStorage
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("upstox_portfolio_data")
      if (storedData) {
        const data: UpstoxPortfolioData = JSON.parse(storedData)
        setPortfolioData(data)

        if (data.holdings && data.holdings.length > 0) {
          const portfolioSummary = convertUpstoxToPortfolioSummary(data.holdings, data.funds)
          setSummary(portfolioSummary)
          setError(null)
        } else {
          setError("No holdings data found. Please ensure you have investments in your Upstox account.")
        }
      } else {
        setError("No portfolio data found. Please go back to the dashboard and click 'Analyze Portfolio'.")
      }
    } catch (err) {
      console.error("Error loading portfolio data:", err)
      setError("Failed to load portfolio data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Memoized calculations to prevent unnecessary re-renders
  const sectorAllocation = useMemo(() => {
    return summary ? calculateSectorAllocation(summary.holdings) : []
  }, [summary])

  const topHoldings = useMemo(() => {
    return summary ? getTopHoldings(summary.holdings, 10) : []
  }, [summary])

  const historyData = useMemo(() => {
    return portfolioData ? generatePortfolioHistoryFromUpstox(portfolioData.holdings, 90) : []
  }, [portfolioData])

  const handleRefresh = async () => {
    if (!portfolioData) return

    setIsLoading(true)
    try {
      // Refresh data from Upstox API
      const headers = {
        Authorization: `Bearer ${portfolioData.accessToken}`,
        "Content-Type": "application/json",
      }

      const holdingsRes = await fetch("/api/upstox/holdings", { headers })
      const fundsRes = await fetch("/api/upstox/funds", { headers })

      if (holdingsRes.ok) {
        const holdingsData = await holdingsRes.json()
        const fundsData = fundsRes.ok ? await fundsRes.json() : portfolioData.funds

        const updatedData = {
          ...portfolioData,
          holdings: Array.isArray(holdingsData) ? holdingsData : [],
          funds: fundsData,
          timestamp: new Date().toISOString(),
        }

        setPortfolioData(updatedData)
        sessionStorage.setItem("upstox_portfolio_data", JSON.stringify(updatedData))

        if (updatedData.holdings.length > 0) {
          const portfolioSummary = convertUpstoxToPortfolioSummary(updatedData.holdings, updatedData.funds)
          setSummary(portfolioSummary)
          setLastUpdated(new Date())
          setError(null)
        }
      }
    } catch (err) {
      console.error("Error refreshing data:", err)
      setError("Failed to refresh data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-3"></div>
          <p className="text-xs text-muted-foreground">Loading your portfolio analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-destructive mb-2">Portfolio Data Not Available</h3>
            <p className="text-xs text-destructive/80 mb-4">{error}</p>
            <Button
              onClick={() => window.history.back()}
              size="sm"
              className="bg-destructive hover:bg-destructive/90 text-xs"
            >
              Go Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Portfolio Analytics</h1>
            <p className="text-xs text-muted-foreground">
              Analyzing {summary.holdings.length} holdings • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            {portfolioData?.profile && (
              <p className="text-xs text-muted-foreground">
                Account: {portfolioData.profile.client_name} ({portfolioData.profile.client_id})
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-xs">
              <Wifi className="h-3 w-3 mr-1" />
              Upstox Data
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 bg-transparent"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <PortfolioSummaryCards summary={summary} isLoading={isLoading} />

        {/* Performance Chart */}
        <PortfolioPerformanceChart data={historyData} isLoading={isLoading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectorAllocationChart data={sectorAllocation} isLoading={isLoading} />
          <TopHoldingsChart holdings={topHoldings} isLoading={isLoading} />
        </div>

        {/* Holdings Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Your Holdings Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.holdings.map((holding) => (
                <div
                  key={holding.symbol}
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div>
                        <h4 className="text-xs font-semibold">{holding.symbol}</h4>
                        <p className="text-xs text-muted-foreground">{holding.companyName}</p>
                        <p className="text-xs text-muted-foreground">
                          {holding.quantity} shares • Avg: ₹{holding.averagePrice.toFixed(2)} • {holding.sector}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <LivePriceIndicator
                      symbol={holding.symbol}
                      currentPrice={holding.currentPrice}
                      change={holding.dayChange}
                      changePercentage={holding.dayChangePercentage}
                      isLive={false}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Value: ₹{holding.marketValue.toLocaleString()}</p>
                    <p className={`text-xs ${holding.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      P&L: ₹{holding.pnl.toLocaleString()} ({holding.pnlPercentage.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
