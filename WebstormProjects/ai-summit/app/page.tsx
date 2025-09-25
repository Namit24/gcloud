"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { UploadDialog } from "@/components/upload-dialog"
import { TransactionList } from "@/components/transaction-list"
import { SpendingCharts } from "@/components/spending-charts"
import { AnalysisCharts } from "@/components/analysis-charts"
import { formatCurrency } from "@/lib/utils"

// Types
interface FinancialMetric {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
}

interface DashboardCardProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

// Utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

// Dashboard Card Component
const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, trend = "neutral", className }) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
        </div>
        {change && <div className={cn("text-xs font-medium", getTrendColor())}>{change}</div>}
      </div>
    </motion.div>
  )
}

// Sidebar Component
const Sidebar: React.FC<{
  isOpen: boolean
  onClose: () => void
  activeSection: string
  setActiveSection: (section: string) => void
}> = ({ isOpen, onClose, activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analysis", label: "Analysis" },
    { id: "simulations", label: "Simulations" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border transition-transform duration-300 z-50 w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <h1 className="text-lg font-bold text-foreground">FinCoPilot</h1>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-muted rounded text-xs">
              ✕
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  onClose()
                }}
                className={cn(
                  "w-full flex items-center px-4 py-3 rounded-lg transition-colors text-xs font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">JD</span>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Premium User</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [financialData, setFinancialData] = useState<any>(null)
  const [hasData, setHasData] = useState(false)

  const handleUploadComplete = (data: any) => {
    console.log("[v0] Upload completed with data:", data)
    setFinancialData(data)
    setHasData(true)
  }

  const metrics =
    hasData && financialData
      ? [
          {
            label: "Opening Balance",
            value: formatCurrency(financialData.openingBalance || 0),
            change: "",
            trend: "neutral" as const,
          },
          {
            label: "Closing Balance",
            value: formatCurrency(financialData.closingBalance || 0),
            change:
              financialData.openingBalance && financialData.closingBalance
                ? `${financialData.closingBalance > financialData.openingBalance ? "+" : ""}${(((financialData.closingBalance - financialData.openingBalance) / Math.abs(financialData.openingBalance)) * 100).toFixed(1)}%`
                : "",
            trend: (financialData.closingBalance > financialData.openingBalance ? "up" : "down") as const,
          },
          {
            label: "Total Income",
            value: formatCurrency(Math.abs(financialData.totalIncome || 0)),
            change: "+100%",
            trend: "up" as const,
          },
          {
            label: "Total Expenses",
            value: formatCurrency(Math.abs(financialData.totalExpenses || 0)),
            change: "",
            trend: "down" as const,
          },
        ]
      : []

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
                <span className="text-xs">☰</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Financial Dashboard</h1>
                <p className="text-xs text-muted-foreground">Welcome back! Here's your financial overview.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-muted rounded-lg relative">
                <span className="text-xs">🔔</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <UploadDialog onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {!hasData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-8 text-center"
                >
                  <div className="w-16 h-16 bg-muted/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No financial data yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Connect your bank accounts or upload documents to see your financial overview.
                  </p>
                  <UploadDialog onUploadComplete={handleUploadComplete} />
                </motion.div>
              )}

              {/* Metrics Grid */}
              {hasData && metrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DashboardCard
                        title={metric.label}
                        value={metric.value}
                        change={metric.change}
                        trend={metric.trend}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Spending Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-foreground">Spending Overview</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-muted rounded-lg text-xs">Filter</button>
                      <button className="p-2 hover:bg-muted rounded-lg text-xs">Export</button>
                    </div>
                  </div>
                  <div className="min-h-64">
                    {hasData && financialData.categories ? (
                      <SpendingCharts
                        categories={financialData.categories}
                        totalExpenses={financialData.totalExpenses}
                      />
                    ) : (
                      <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Upload documents to see spending analysis</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <h3 className="text-base font-semibold text-foreground mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {hasData && financialData.transactions && financialData.transactions.length > 0 ? (
                      <TransactionList transactions={financialData.transactions} />
                    ) : (
                      <div className="text-center py-8">
                        <span className="text-2xl mb-2 block">📄</span>
                        <p className="text-xs text-muted-foreground">No recent transactions</p>
                        <p className="text-xs text-muted-foreground mt-1">Upload bank statements to see activity</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* AI Insights */}
              {hasData && financialData.insights && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <h3 className="text-base font-semibold text-foreground mb-6">AI Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {financialData.insights.map((insight: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground leading-relaxed">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="text-base font-semibold text-foreground mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-xs font-medium">
                    Upload Documents
                  </button>
                  <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-xs font-medium">
                    Run Simulation
                  </button>
                  <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-xs font-medium">
                    View Suggestions
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {activeSection === "analysis" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Analysis</h2>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 bg-card border border-border rounded-lg text-xs">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                    Export Report
                  </button>
                </div>
              </div>

              {hasData && financialData ? (
                <AnalysisCharts data={financialData} />
              ) : (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <div className="w-16 h-16 bg-muted/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">🔍</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">No analysis available yet</h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Upload financial documents to get detailed insights and analysis.
                  </p>
                  <UploadDialog onUploadComplete={handleUploadComplete} />
                </div>
              )}
            </div>
          )}

          {activeSection === "simulations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Simulations</h2>
              </div>
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">📊</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">No simulations run yet</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Run scenarios to see how different financial decisions could impact your future wealth and tax
                  obligations.
                </p>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Settings</h2>
              </div>
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">⚙️</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">No settings configured yet</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Configure your settings to personalize your experience.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <Dashboard />
}
