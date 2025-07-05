"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import type { CombinedPortfolio } from "@/utils/portfolio-merger"

interface BenchmarkData {
  date: string
  portfolio: number
  nifty50: number
  sensex: number
  niftyNext50: number
  bankNifty: number
}

interface PortfolioPerformanceComparisonProps {
  combinedPortfolio: CombinedPortfolio
}

export function PortfolioPerformanceComparison({ combinedPortfolio }: PortfolioPerformanceComparisonProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState("nifty50")
  const [timePeriod, setTimePeriod] = useState("1Y")

  // Mock benchmark data - in production, fetch from market data API
  const generateBenchmarkData = (): BenchmarkData[] => {
    const data: BenchmarkData[] = []
    const basePortfolioValue = combinedPortfolio.totalNetWorth

    for (let i = 365; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Simulate portfolio performance with some volatility
      const portfolioChange = (Math.random() - 0.5) * 0.02 // ±2% daily volatility
      const portfolioValue = basePortfolioValue * (1 + (portfolioChange * (365 - i)) / 365)

      // Simulate benchmark performance
      const niftyChange = (Math.random() - 0.5) * 0.015 // ±1.5% daily volatility
      const sensexChange = (Math.random() - 0.5) * 0.015
      const niftyNext50Change = (Math.random() - 0.5) * 0.02
      const bankNiftyChange = (Math.random() - 0.5) * 0.025

      data.push({
        date: date.toISOString().split("T")[0],
        portfolio: portfolioValue,
        nifty50: 100 * (1 + (niftyChange * (365 - i)) / 365),
        sensex: 100 * (1 + (sensexChange * (365 - i)) / 365),
        niftyNext50: 100 * (1 + (niftyNext50Change * (365 - i)) / 365),
        bankNifty: 100 * (1 + (bankNiftyChange * (365 - i)) / 365),
      })
    }

    return data
  }

  const benchmarkData = generateBenchmarkData()

  const getFilteredData = () => {
    const days = timePeriod === "1M" ? 30 : timePeriod === "3M" ? 90 : timePeriod === "6M" ? 180 : 365
    return benchmarkData.slice(-days)
  }

  const filteredData = getFilteredData()
  const latestData = filteredData[filteredData.length - 1]
  const firstData = filteredData[0]

  const calculateReturns = (latest: number, first: number) => {
    return ((latest - first) / first) * 100
  }

  const portfolioReturns = calculateReturns(latestData.portfolio, firstData.portfolio)
  const benchmarkReturns = calculateReturns(latestData[selectedBenchmark], firstData[selectedBenchmark])
  const outperformance = portfolioReturns - benchmarkReturns

  const benchmarks = [
    { id: "nifty50", name: "Nifty 50", color: "#3b82f6" },
    { id: "sensex", name: "Sensex", color: "#10b981" },
    { id: "niftyNext50", name: "Nifty Next 50", color: "#f59e0b" },
    { id: "bankNifty", name: "Bank Nifty", color: "#ef4444" },
  ]

  const selectedBenchmarkInfo = benchmarks.find((b) => b.id === selectedBenchmark)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="text-xs text-muted-foreground">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name === "portfolio" ? `₹${entry.value.toLocaleString()}` : `${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Performance vs Benchmarks</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {benchmarks.map((benchmark) => (
                    <SelectItem key={benchmark.id} value={benchmark.id}>
                      {benchmark.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1M</SelectItem>
                  <SelectItem value="3M">3M</SelectItem>
                  <SelectItem value="6M">6M</SelectItem>
                  <SelectItem value="1Y">1Y</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Your Portfolio</div>
              <div className={`text-xl font-bold ${portfolioReturns >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {portfolioReturns >= 0 ? "+" : ""}
                {portfolioReturns.toFixed(2)}%
              </div>
              <div className="flex items-center justify-center mt-1">
                {portfolioReturns >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">{selectedBenchmarkInfo?.name}</div>
              <div className={`text-xl font-bold ${benchmarkReturns >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {benchmarkReturns >= 0 ? "+" : ""}
                {benchmarkReturns.toFixed(2)}%
              </div>
              <div className="flex items-center justify-center mt-1">
                {benchmarkReturns >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Outperformance</div>
              <div className={`text-xl font-bold ${outperformance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {outperformance >= 0 ? "+" : ""}
                {outperformance.toFixed(2)}%
              </div>
              <Badge
                className={`mt-1 ${outperformance >= 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
              >
                {outperformance >= 0 ? "Outperforming" : "Underperforming"}
              </Badge>
            </div>
          </div>

          {/* Performance Chart */}
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
                  yAxisId="portfolio"
                  orientation="left"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  yAxisId="benchmark"
                  orientation="right"
                  tickFormatter={(value) => value.toFixed(0)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="portfolio"
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                  name="Your Portfolio"
                />
                <Line
                  yAxisId="benchmark"
                  type="monotone"
                  dataKey={selectedBenchmark}
                  stroke={selectedBenchmarkInfo?.color}
                  strokeWidth={2}
                  dot={false}
                  name={selectedBenchmarkInfo?.name}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alpha (vs {selectedBenchmarkInfo?.name})</span>
                  <span className={`text-sm font-medium ${outperformance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {outperformance.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Beta</span>
                  <span className="text-sm font-medium">1.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  <span className="text-sm font-medium">0.85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Max Drawdown</span>
                  <span className="text-sm font-medium text-red-600">-12.5%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Performance Summary</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Your portfolio has {outperformance >= 0 ? "outperformed" : "underperformed"} the{" "}
                  {selectedBenchmarkInfo?.name} by{" "}
                  <span className={`font-semibold ${outperformance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {Math.abs(outperformance).toFixed(2)}%
                  </span>{" "}
                  over the selected period.
                </p>
                {outperformance >= 0 ? (
                  <p className="text-emerald-700 dark:text-emerald-300">
                    🎉 Great job! Your investment strategy is working well. Consider maintaining your current
                    allocation.
                  </p>
                ) : (
                  <p className="text-red-700 dark:text-red-300">
                    📊 Your portfolio is underperforming. Consider reviewing your asset allocation and investment
                    strategy.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
