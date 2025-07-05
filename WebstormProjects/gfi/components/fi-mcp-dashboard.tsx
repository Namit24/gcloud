"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FiMcpPortfolio } from "@/types/fi-mcp"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw,
  AlertCircle,
  Banknote,
  CreditCard,
  Target,
} from "lucide-react"

interface FiMcpDashboardProps {
  passcode: string
}

export function FiMcpDashboard({ passcode }: FiMcpDashboardProps) {
  const [portfolio, setPortfolio] = useState<FiMcpPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFiMcpData = async () => {
    setSyncing(true)
    setError(null)

    try {
      const headers = {
        Authorization: `Bearer ${passcode}`,
        "Content-Type": "application/json",
      }

      const response = await fetch("/api/fi-mcp/portfolio", { headers })

      if (!response.ok) {
        throw new Error("Failed to fetch Fi MCP data")
      }

      const portfolioData = await response.json()
      setPortfolio(portfolioData)
    } catch (error) {
      console.error("Failed to fetch Fi MCP data:", error)
      setError("Failed to fetch data from Fi MCP. Please check your connection and try again.")
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (passcode) {
      fetchFiMcpData()
    }
  }, [passcode])

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

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "savings":
      case "current":
        return <Banknote className="h-3 w-3 text-blue-600" />
      case "credit_card":
        return <CreditCard className="h-3 w-3 text-purple-600" />
      default:
        return <DollarSign className="h-3 w-3 text-gray-600" />
    }
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

  if (error || !portfolio) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-destructive mb-1">Connection Error</h3>
          <p className="text-xs text-destructive/80 mb-3">{error}</p>
          <Button
            onClick={fetchFiMcpData}
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
      {/* Fi MCP Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Fi</span>
              </div>
              <div>
                <h2 className="text-sm font-bold">Fi MCP Portfolio</h2>
                <p className="text-xs text-muted-foreground">
                  {portfolio.accounts.length} accounts • {portfolio.mutual_funds.length} mutual funds
                </p>
              </div>
            </div>
            <Button
              onClick={fetchFiMcpData}
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Banknote className="h-3 w-3 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Balance</p>
                <p className="text-sm font-bold">{formatCurrency(portfolio.total_balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Target className="h-3 w-3 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Investments</p>
                <p className="text-sm font-bold">{formatCurrency(portfolio.total_investments)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {portfolio.total_pnl >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Investment P&L</p>
                <p className={`text-sm font-bold ${portfolio.total_pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {formatCurrency(portfolio.total_pnl)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <PieChart className="h-3 w-3 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Net Worth</p>
                <p className="text-sm font-bold">
                  {formatCurrency(portfolio.total_balance + portfolio.total_investments)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data */}
      <Tabs defaultValue="accounts" className="space-y-2">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="accounts" className="text-xs py-1">
            Accounts ({portfolio.accounts.length})
          </TabsTrigger>
          <TabsTrigger value="mutual-funds" className="text-xs py-1">
            Mutual Funds ({portfolio.mutual_funds.length})
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs py-1">
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {portfolio.accounts.map((account) => (
                  <div
                    key={account.account_id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getAccountTypeIcon(account.account_type)}
                        <div>
                          <h4 className="text-xs font-semibold">{account.account_name}</h4>
                          <p className="text-xs text-muted-foreground">{account.bank_name}</p>
                          <Badge variant="outline" className="text-xs px-1 py-0 mt-1">
                            {account.account_type.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${account.balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(account.balance)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(account.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mutual-funds">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Mutual Fund Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {portfolio.mutual_funds.map((fund) => (
                  <div
                    key={fund.scheme_code}
                    className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold">{fund.scheme_name}</h4>
                      <p className="text-xs text-muted-foreground">{fund.amc_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Units: {fund.units.toFixed(2)} • NAV: ₹{fund.nav.toFixed(2)}
                      </p>
                      {fund.sip_amount && (
                        <Badge variant="secondary" className="text-xs px-1 py-0 mt-1">
                          SIP: ₹{fund.sip_amount}/month
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{formatCurrency(fund.current_value)}</p>
                      <p className={`text-xs ${fund.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(fund.pnl)} ({formatPercentage(fund.pnl_percentage)})
                      </p>
                      <p className="text-xs text-muted-foreground">Invested: {formatCurrency(fund.invested_amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {portfolio.transactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction.transaction_id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold">{transaction.description}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold ${
                          transaction.type === "credit" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance: {formatCurrency(transaction.balance_after)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
