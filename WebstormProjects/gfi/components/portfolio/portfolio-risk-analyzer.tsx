"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, TrendingUp, BarChart3, PieChart } from "lucide-react"
import type { CombinedPortfolio } from "@/utils/portfolio-merger"

interface RiskMetric {
  name: string
  value: number
  maxValue: number
  status: "low" | "medium" | "high"
  description: string
  recommendation?: string
}

interface PortfolioRiskAnalyzerProps {
  combinedPortfolio: CombinedPortfolio
}

export function PortfolioRiskAnalyzer({ combinedPortfolio }: PortfolioRiskAnalyzerProps) {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([])
  const [overallRiskScore, setOverallRiskScore] = useState(0)
  const [riskProfile, setRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate")

  useEffect(() => {
    calculateRiskMetrics()
  }, [combinedPortfolio])

  const calculateRiskMetrics = () => {
    const metrics: RiskMetric[] = []

    // Concentration Risk
    const totalValue = combinedPortfolio.totalNetWorth
    const topHoldings = combinedPortfolio.combinedHoldings.sort((a, b) => b.marketValue - a.marketValue).slice(0, 3)

    const top3Concentration = (topHoldings.reduce((sum, holding) => sum + holding.marketValue, 0) / totalValue) * 100

    metrics.push({
      name: "Concentration Risk",
      value: top3Concentration,
      maxValue: 100,
      status: top3Concentration > 50 ? "high" : top3Concentration > 30 ? "medium" : "low",
      description: `Top 3 holdings represent ${top3Concentration.toFixed(1)}% of portfolio`,
      recommendation: top3Concentration > 40 ? "Consider diversifying your top holdings" : undefined,
    })

    // Volatility Risk (based on sector allocation)
    const equityPercentage = (combinedPortfolio.totalTradingValue / totalValue) * 100
    metrics.push({
      name: "Market Volatility Risk",
      value: equityPercentage,
      maxValue: 100,
      status: equityPercentage > 70 ? "high" : equityPercentage > 40 ? "medium" : "low",
      description: `${equityPercentage.toFixed(1)}% allocation to equity markets`,
      recommendation: equityPercentage > 80 ? "Consider adding debt instruments for stability" : undefined,
    })

    // Liquidity Risk
    const cashPercentage = (combinedPortfolio.totalCash / totalValue) * 100
    metrics.push({
      name: "Liquidity Risk",
      value: 100 - cashPercentage,
      maxValue: 100,
      status: cashPercentage < 5 ? "high" : cashPercentage < 15 ? "medium" : "low",
      description: `${cashPercentage.toFixed(1)}% in liquid cash/savings`,
      recommendation: cashPercentage < 10 ? "Maintain at least 10% in liquid assets" : undefined,
    })

    // Currency Risk (assuming all INR for now)
    metrics.push({
      name: "Currency Risk",
      value: 0,
      maxValue: 100,
      status: "low",
      description: "All investments in INR - no foreign currency exposure",
    })

    // Credit Risk (based on debt instruments)
    const debtPercentage = (combinedPortfolio.totalInvestments / totalValue) * 100
    metrics.push({
      name: "Credit Risk",
      value: debtPercentage * 0.3, // Assuming 30% of mutual funds are debt
      maxValue: 100,
      status: debtPercentage > 60 ? "medium" : "low",
      description: `Estimated ${(debtPercentage * 0.3).toFixed(1)}% in debt instruments`,
    })

    setRiskMetrics(metrics)

    // Calculate overall risk score
    const avgRisk =
      metrics.reduce((sum, metric) => {
        const riskValue = metric.status === "high" ? 3 : metric.status === "medium" ? 2 : 1
        return sum + riskValue
      }, 0) / metrics.length

    setOverallRiskScore(avgRisk)
    setRiskProfile(avgRisk > 2.5 ? "aggressive" : avgRisk > 1.5 ? "moderate" : "conservative")
  }

  const getRiskColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case "aggressive":
        return "text-red-600 bg-red-50 border-red-200"
      case "moderate":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "conservative":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Portfolio Risk Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-1">{(overallRiskScore * 33.33).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Overall Risk Score</div>
              <Progress value={overallRiskScore * 33.33} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Badge className={`${getProfileColor(riskProfile)} mb-2`}>{riskProfile.toUpperCase()}</Badge>
              <div className="text-sm text-muted-foreground">Risk Profile</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-1">{riskMetrics.filter((m) => m.recommendation).length}</div>
              <div className="text-sm text-muted-foreground">Recommendations</div>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-3">Risk Breakdown</h4>
            {riskMetrics.map((metric, index) => (
              <Card
                key={index}
                className="border-l-4"
                style={{
                  borderLeftColor:
                    metric.status === "high" ? "#ef4444" : metric.status === "medium" ? "#f97316" : "#10b981",
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{metric.name}</h5>
                    <Badge className={getRiskColor(metric.status)}>{metric.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
                  <Progress value={(metric.value / metric.maxValue) * 100} className="mb-2" />
                  {metric.recommendation && (
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg mt-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Recommendation</p>
                          <p className="text-sm text-orange-700 dark:text-orange-300">{metric.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <PieChart className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Diversification</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Spread investments across different asset classes, sectors, and geographies.
              </p>
              <Button variant="outline" size="sm">
                View Diversification Plan
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">Rebalancing</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Regularly adjust portfolio allocation to maintain target risk levels.
              </p>
              <Button variant="outline" size="sm">
                Auto-Rebalance Setup
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Hedging</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Use derivatives or inverse ETFs to protect against market downturns.
              </p>
              <Button variant="outline" size="sm">
                Explore Hedging Options
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold">Dollar Cost Averaging</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Invest fixed amounts regularly to reduce timing risk and volatility.
              </p>
              <Button variant="outline" size="sm">
                Setup SIP Strategy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
