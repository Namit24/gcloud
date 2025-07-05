"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Send, Loader2, TrendingUp, AlertTriangle, Target, Lightbulb } from "lucide-react"
import type { CombinedPortfolio } from "@/utils/portfolio-merger"

interface PortfolioInsightsAIProps {
  combinedPortfolio: CombinedPortfolio
}

interface AIInsight {
  type: "optimization" | "risk" | "opportunity" | "alert"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  actionable: boolean
  action?: string
}

export function PortfolioInsightsAI({ combinedPortfolio }: PortfolioInsightsAIProps) {
  const [query, setQuery] = useState("")
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  const generateInsights = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis (replace with actual AI SDK call)
    setTimeout(() => {
      const mockInsights: AIInsight[] = [
        {
          type: "optimization",
          title: "Portfolio Rebalancing Opportunity",
          description: `Your portfolio is heavily weighted towards ${combinedPortfolio.totalTradingValue > combinedPortfolio.totalInvestments ? "trading stocks" : "mutual funds"}. Consider rebalancing for better diversification.`,
          impact: "high",
          actionable: true,
          action: "Rebalance portfolio to 60% equity, 30% mutual funds, 10% cash",
        },
        {
          type: "risk",
          title: "Concentration Risk Detected",
          description:
            "Your top 3 holdings represent more than 40% of your portfolio. This increases concentration risk.",
          impact: "medium",
          actionable: true,
          action: "Diversify by reducing position sizes in top holdings",
        },
        {
          type: "opportunity",
          title: "SIP Optimization",
          description: "Based on your cash flow, you can increase your SIP by ₹3,000/month to reach your goals faster.",
          impact: "high",
          actionable: true,
          action: "Increase monthly SIP from current amount to ₹8,000",
        },
        {
          type: "alert",
          title: "Underperforming Assets",
          description:
            "2 of your mutual funds have underperformed their benchmark by more than 5% in the last 6 months.",
          impact: "medium",
          actionable: true,
          action: "Review and consider switching to better performing funds",
        },
      ]

      setInsights(mockInsights)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleChat = async () => {
    if (!query.trim()) return

    const userMessage = { role: "user" as const, content: query }
    setChatHistory((prev) => [...prev, userMessage])
    setQuery("")
    setIsAnalyzing(true)

    // Simulate AI response (replace with actual AI SDK call)
    setTimeout(() => {
      const responses = [
        "Based on your portfolio data, I can see you have a good mix of trading and investment assets. Your total net worth of ₹" +
          combinedPortfolio.totalNetWorth.toLocaleString() +
          " shows healthy financial growth.",
        "Your current P&L of ₹" +
          combinedPortfolio.totalPnl.toLocaleString() +
          " indicates " +
          (combinedPortfolio.totalPnl >= 0 ? "positive" : "negative") +
          " performance. I recommend focusing on diversification.",
        "Looking at your asset allocation, you have ₹" +
          combinedPortfolio.totalTradingValue.toLocaleString() +
          " in trading and ₹" +
          combinedPortfolio.totalInvestments.toLocaleString() +
          " in investments. This shows a balanced approach.",
        "Your cash position of ₹" +
          combinedPortfolio.totalCash.toLocaleString() +
          " provides good liquidity. Consider investing some of this in systematic investment plans for long-term growth.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const assistantMessage = { role: "assistant" as const, content: randomResponse }

      setChatHistory((prev) => [...prev, assistantMessage])
      setIsAnalyzing(false)
    }, 1500)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <Target className="h-4 w-4" />
      case "risk":
        return <AlertTriangle className="h-4 w-4" />
      case "opportunity":
        return <TrendingUp className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string, impact: string) => {
    const baseColors = {
      optimization: "blue",
      risk: "red",
      opportunity: "green",
      alert: "orange",
    }

    const color = baseColors[type] || "gray"
    const intensity = impact === "high" ? "600" : impact === "medium" ? "500" : "400"

    return `text-${color}-${intensity} bg-${color}-50 border-${color}-200 dark:bg-${color}-950/20 dark:border-${color}-800`
  }

  return (
    <div className="space-y-6">
      {/* AI Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Financial Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-3 p-3 bg-muted/50 rounded-lg">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask me anything about your portfolio... e.g., 'How can I optimize my investments?' or 'What's my risk level?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleChat()
                }
              }}
            />
            <Button onClick={handleChat} disabled={isAnalyzing || !query.trim()} className="px-4">
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Portfolio Insights</CardTitle>
            <Button onClick={generateInsights} disabled={isAnalyzing} variant="outline" size="sm">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Click "Generate Insights" to get AI-powered portfolio analysis</p>
              <p className="text-sm mt-1">I'll analyze your holdings, risk profile, and suggest optimizations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${getInsightColor(insight.type, insight.impact)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type, insight.impact)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {insight.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                        {insight.actionable && insight.action && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-2">💡 Recommended Action:</p>
                            <p className="text-sm">{insight.action}</p>
                            <Button size="sm" className="mt-2 text-xs">
                              Take Action
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
