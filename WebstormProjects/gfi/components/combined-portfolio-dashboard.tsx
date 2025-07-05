"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mergePortfolioData, formatCurrency, formatPercentage } from "@/utils/portfolio-merger"
import type { CombinedPortfolio } from "@/utils/portfolio-merger"
import type { UpstoxHolding } from "@/types/upstox"
import type { FiMcpPortfolio } from "@/types/fi-mcp"
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, Wallet, Target, BarChart3 } from "lucide-react"

interface CombinedPortfolioDashboardProps {
  upstoxHoldings?: UpstoxHolding[]
  fiMcpPortfolio?: FiMcpPortfolio
  onRefresh?: () => void
  isLoading?: boolean
}

export function CombinedPortfolioDashboard({
  upstoxHoldings,
  fiMcpPortfolio,
  onRefresh,
  isLoading = false,
}: CombinedPortfolioDashboardProps) {
  const [combinedData, setCombinedData] = useState<CombinedPortfolio | null>(null)

  useEffect(() => {
    const merged = mergePortfolioData(upstoxHoldings, fiMcpPortfolio)
    setCombinedData(merged)
  }, [upstoxHoldings, fiMcpPortfolio])

  if (isLoading || !combinedData) {
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

  return (
    <div className="space-y-4">
      {/* Combined Portfolio Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Complete Financial Overview</h2>
              <p className="text-sm text-muted-foreground">Combined view of your trading portfolio and investments</p>
              <div className="flex space-x-2 mt-2">
                {combinedData.upstoxData && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    Upstox Connected
                  </Badge>
                )}
                {combinedData.fiMcpData && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Fi MCP Connected
                  </Badge>
                )}
              </div>
            </div>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="text-xs px-3 py-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Combined Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Net Worth</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(combinedData.totalNetWorth)}</p>
                <p className="text-xs text-muted-foreground mt-1">Trading + Investments + Cash</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trading Portfolio</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(combinedData.totalTradingValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">Upstox Holdings</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Investments</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(combinedData.totalInvestments)}</p>
                <p className="text-xs text-muted-foreground mt-1">Mutual Funds</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total P&L</p>
                <p className={`text-xl font-bold ${combinedData.totalPnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(combinedData.totalPnl)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Combined Gains/Losses</p>
              </div>
              <div
                className={`p-3 rounded-lg ${combinedData.totalPnl >= 0 ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20"}`}
              >
                {combinedData.totalPnl >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="cash">Cash & Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>All Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {combinedData.combinedHoldings.map((holding, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{holding.symbol}</h4>
                          <p className="text-sm text-muted-foreground">{holding.companyName}</p>
                          <div className="flex space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {holding.sector}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {holding.exchange}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(holding.marketValue)}</p>
                      <p className={`text-sm ${holding.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(holding.pnl)} ({formatPercentage(holding.pnlPercentage)})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {holding.quantity.toFixed(2)} • Avg: ₹{holding.averagePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading">
          <Card>
            <CardHeader>
              <CardTitle>Trading Portfolio (Upstox)</CardTitle>
            </CardHeader>
            <CardContent>
              {combinedData.upstoxData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-bold">{formatCurrency(combinedData.upstoxData.totalValue)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total P&L</p>
                      <p
                        className={`font-bold ${combinedData.upstoxData.totalPnl >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {formatCurrency(combinedData.upstoxData.totalPnl)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Holdings</p>
                      <p className="font-bold">{combinedData.upstoxData.holdings.length}</p>
                    </div>
                  </div>
                  {combinedData.upstoxData.holdings.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{holding.tradingsymbol}</h4>
                        <p className="text-sm text-muted-foreground">{holding.company_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(holding.quantity * holding.last_price)}</p>
                        <p className={`text-sm ${holding.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {formatCurrency(holding.pnl)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No Upstox connection found</p>
                  <p className="text-sm">Connect your Upstox account to view trading data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio (Fi MCP)</CardTitle>
            </CardHeader>
            <CardContent>
              {combinedData.fiMcpData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Investments</p>
                      <p className="font-bold">{formatCurrency(combinedData.fiMcpData.totalInvestments)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total P&L</p>
                      <p
                        className={`font-bold ${combinedData.fiMcpData.totalPnl >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {formatCurrency(combinedData.fiMcpData.totalPnl)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Mutual Funds</p>
                      <p className="font-bold">{combinedData.fiMcpData.mutualFunds.length}</p>
                    </div>
                  </div>
                  {combinedData.fiMcpData.mutualFunds.map((fund: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{fund.scheme_name}</h4>
                        <p className="text-sm text-muted-foreground">{fund.amc_name}</p>
                        {fund.sip_amount && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            SIP: ₹{fund.sip_amount}/month
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(fund.current_value)}</p>
                        <p className={`text-sm ${fund.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {formatCurrency(fund.pnl)} ({formatPercentage(fund.pnl_percentage)})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No Fi MCP connection found</p>
                  <p className="text-sm">Connect your Fi MCP account to view investment data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash">
          <Card>
            <CardHeader>
              <CardTitle>Cash & Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {combinedData.fiMcpData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Cash</p>
                      <p className="font-bold">{formatCurrency(combinedData.fiMcpData.totalBalance)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Accounts</p>
                      <p className="font-bold">{combinedData.fiMcpData.accounts.length}</p>
                    </div>
                  </div>
                  {combinedData.fiMcpData.accounts.map((account: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{account.account_name}</h4>
                        <p className="text-sm text-muted-foreground">{account.bank_name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {account.account_type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${account.balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {formatCurrency(account.balance)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(account.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No Fi MCP connection found</p>
                  <p className="text-sm">Connect your Fi MCP account to view bank account data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
