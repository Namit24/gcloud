"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import type { UpstoxHolding, UpstoxPosition, UpstoxFunds, UpstoxProfile } from "@/types/upstox"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface UpstoxDashboardProps {
  accessToken: string
}

export function UpstoxDashboard({ accessToken }: UpstoxDashboardProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<UpstoxProfile | null>(null)
  const [holdings, setHoldings] = useState<UpstoxHolding[]>([])
  const [positions, setPositions] = useState<UpstoxPosition[]>([])
  const [funds, setFunds] = useState<UpstoxFunds | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const fetchUpstoxData = async () => {
    setSyncing(true)
    setError(null)

    try {
      console.log("Fetching Upstox data with token:", accessToken ? "Token present" : "No token")

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }

      const [profileRes, holdingsRes, positionsRes, fundsRes] = await Promise.all([
        fetch("/api/upstox/profile", { headers }),
        fetch("/api/upstox/holdings", { headers }),
        fetch("/api/upstox/positions", { headers }),
        fetch("/api/upstox/funds", { headers }),
      ])

      console.log("API Response statuses:", {
        profile: profileRes.status,
        holdings: holdingsRes.status,
        positions: positionsRes.status,
        funds: fundsRes.status,
      })

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        console.log("Profile data:", profileData)
        setProfile(profileData)
      } else {
        const errorData = await profileRes.json()
        console.error("Profile error:", errorData)
      }

      if (holdingsRes.ok) {
        const holdingsData = await holdingsRes.json()
        console.log("Holdings data:", holdingsData)
        setHoldings(Array.isArray(holdingsData) ? holdingsData : [])
      } else {
        const errorData = await holdingsRes.json()
        console.error("Holdings error:", errorData)
      }

      if (positionsRes.ok) {
        const positionsData = await positionsRes.json()
        console.log("Positions data:", positionsData)
        setPositions(Array.isArray(positionsData) ? positionsData : [])
      } else {
        const errorData = await positionsRes.json()
        console.error("Positions error:", errorData)
      }

      if (fundsRes.ok) {
        const fundsData = await fundsRes.json()
        console.log("Funds data:", fundsData)
        setFunds(fundsData)
      } else {
        const errorData = await fundsRes.json()
        console.error("Funds error:", errorData)
      }

      // Check if all requests failed
      if (!profileRes.ok && !holdingsRes.ok && !positionsRes.ok && !fundsRes.ok) {
        setError("Failed to fetch data from Upstox. Please check your connection and try again.")
      }
    } catch (error) {
      console.error("Failed to fetch Upstox data:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  const handleAnalyzePortfolio = async () => {
    setAnalyzing(true)
    try {
      // Store the current portfolio data in sessionStorage for the analytics page
      const portfolioData = {
        holdings,
        positions,
        funds,
        profile,
        accessToken,
        timestamp: new Date().toISOString(),
      }

      sessionStorage.setItem("upstox_portfolio_data", JSON.stringify(portfolioData))

      // Navigate to the analytics page
      router.push("/portfolio")
    } catch (error) {
      console.error("Error preparing portfolio analysis:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchUpstoxData()
    } else {
      setError("No access token available")
      setLoading(false)
    }
  }, [accessToken])

  const totalHoldingsValue = holdings.reduce((sum, holding) => sum + holding.quantity * holding.last_price, 0)
  const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0)
  const totalDayChange = holdings.reduce((sum, holding) => sum + holding.quantity * holding.day_change, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="h-2 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-destructive mb-1">Connection Error</h3>
          <p className="text-xs text-destructive/80 mb-3">{error}</p>
          <Button
            onClick={fetchUpstoxData}
            disabled={syncing}
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Retrying..." : "Retry Connection"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Profile Header */}
      {profile && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image src="/upstox-logo.png" alt="Upstox" width={24} height={24} className="rounded" />
                <div>
                  <h2 className="text-sm font-bold">{profile.client_name}</h2>
                  <p className="text-xs text-muted-foreground">Client ID: {profile.client_id}</p>
                  <div className="flex space-x-1 mt-1">
                    {profile.exchanges.map((exchange) => (
                      <Badge key={exchange} variant="secondary" className="text-xs px-1 py-0">
                        {exchange}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={fetchUpstoxData}
                disabled={syncing}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 bg-transparent"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <PieChart className="h-3 w-3 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
                <p className="text-sm font-bold">{formatCurrency(totalHoldingsValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {totalPnL >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Total P&L</p>
                <p className={`text-sm font-bold ${totalPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(totalPnL)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {totalDayChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Day Change</p>
                <p className={`text-sm font-bold ${totalDayChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(totalDayChange)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-3 w-3 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Available Funds</p>
                <p className="text-sm font-bold">{funds ? formatCurrency(funds.equity.available_margin) : "₹0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data */}
      <Tabs defaultValue="holdings" className="space-y-2">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="holdings" className="text-xs py-1">
            Holdings ({holdings.length})
          </TabsTrigger>
          <TabsTrigger value="positions" className="text-xs py-1">
            Positions ({positions.length})
          </TabsTrigger>
          <TabsTrigger value="funds" className="text-xs py-1">
            Funds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="holdings">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Your Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {holdings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold">{holding.company_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {holding.tradingsymbol} • {holding.exchange}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {holding.quantity} • Avg: {formatCurrency(holding.average_price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{formatCurrency(holding.quantity * holding.last_price)}</p>
                      <p className={`text-xs ${holding.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(holding.pnl)} ({formatPercentage(holding.day_change_percentage)})
                      </p>
                      <p className="text-xs text-muted-foreground">LTP: {formatCurrency(holding.last_price)}</p>
                    </div>
                  </div>
                ))}
                {holdings.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-xs">
                    No holdings found. Start investing to see your portfolio here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold">{position.tradingsymbol}</h4>
                      <p className="text-xs text-muted-foreground">
                        {position.exchange} • {position.product}
                      </p>
                      <p className="text-xs text-muted-foreground">Qty: {position.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{formatCurrency(position.value)}</p>
                      <p className={`text-xs ${position.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        P&L: {formatCurrency(position.pnl)}
                      </p>
                      <p className="text-xs text-muted-foreground">LTP: {formatCurrency(position.last_price)}</p>
                    </div>
                  </div>
                ))}
                {positions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-xs">No open positions found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funds">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Fund Details</CardTitle>
            </CardHeader>
            <CardContent>
              {funds && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold">Available Funds</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Available Margin:</span>
                          <span className="text-xs font-semibold">{formatCurrency(funds.equity.available_margin)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Used Margin:</span>
                          <span className="text-xs font-semibold">{formatCurrency(funds.equity.used_margin)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Payin Amount:</span>
                          <span className="text-xs font-semibold">{formatCurrency(funds.equity.payin_amount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold">P&L Summary</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Realised P&L:</span>
                          <span
                            className={`text-xs font-semibold ${funds.equity.realised >= 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {formatCurrency(funds.equity.realised)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Unrealised P&L:</span>
                          <span
                            className={`text-xs font-semibold ${funds.equity.unrealised >= 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {formatCurrency(funds.equity.unrealised)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-semibold mb-2">Margin Utilization</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Used: {formatCurrency(funds.equity.used_margin)}</span>
                        <span>Available: {formatCurrency(funds.equity.available_margin)}</span>
                      </div>
                      <Progress
                        value={
                          (funds.equity.used_margin / (funds.equity.used_margin + funds.equity.available_margin)) * 100
                        }
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 bg-transparent"
              onClick={() => window.open("https://pro.upstox.com", "_blank")}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View on Upstox
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 bg-transparent"
              onClick={handleAnalyzePortfolio}
              disabled={analyzing || holdings.length === 0}
            >
              <BarChart3 className={`h-3 w-3 mr-1 ${analyzing ? "animate-spin" : ""}`} />
              {analyzing ? "Analyzing..." : "Analyze Portfolio"}
            </Button>
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 bg-transparent">
              <PieChart className="h-3 w-3 mr-1" />
              Rebalance Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
