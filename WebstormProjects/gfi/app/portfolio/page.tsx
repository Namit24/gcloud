"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { SignInDialog } from "@/components/auth/sign-in-dialog"
import { EnhancedPortfolioDashboard } from "@/components/portfolio/enhanced-portfolio-dashboard"
import { PortfolioInsightsAI } from "@/components/portfolio/portfolio-insights-ai"
import { PortfolioGoalsTracker } from "@/components/portfolio/portfolio-goals-tracker"
import { PortfolioRiskAnalyzer } from "@/components/portfolio/portfolio-risk-analyzer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { mergePortfolioData } from "@/utils/portfolio-merger"
import type { CombinedPortfolio } from "@/utils/portfolio-merger"

export default function PortfolioPage() {
  const { user, loading } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [combinedPortfolio, setCombinedPortfolio] = useState<CombinedPortfolio | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      setShowSignIn(true)
    }
  }, [user, loading])

  useEffect(() => {
    // Load portfolio data from sessionStorage or API
    const loadPortfolioData = () => {
      try {
        const storedData = sessionStorage.getItem("upstox_portfolio_data")
        if (storedData) {
          const data = JSON.parse(storedData)
          const merged = mergePortfolioData(data.holdings, null) // Add Fi MCP data when available
          setCombinedPortfolio(merged)
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error)
      }
    }

    if (user) {
      loadPortfolioData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Sign in to view your portfolio analytics</h1>
          <p className="text-sm text-gray-600 mb-6">Access advanced portfolio insights and real-time market data</p>
        </div>
        <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Portfolio Analytics Suite</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis, AI insights, and goal tracking for your complete financial portfolio
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <EnhancedPortfolioDashboard enableLiveData={false} />
        </TabsContent>

        <TabsContent value="analytics">
          <EnhancedPortfolioDashboard enableLiveData={true} />
        </TabsContent>

        <TabsContent value="ai-insights">
          {combinedPortfolio ? (
            <PortfolioInsightsAI combinedPortfolio={combinedPortfolio} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Connect your accounts to get AI-powered insights</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals">
          {combinedPortfolio ? (
            <PortfolioGoalsTracker combinedPortfolio={combinedPortfolio} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Connect your accounts to track financial goals</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="risk">
          {combinedPortfolio ? (
            <PortfolioRiskAnalyzer combinedPortfolio={combinedPortfolio} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Connect your accounts to analyze portfolio risk</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
