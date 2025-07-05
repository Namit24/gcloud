"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { SignInDialog } from "@/components/auth/sign-in-dialog"
import { UpstoxDashboard } from "@/components/upstox-dashboard"
import { AddConnectionDialog } from "@/components/add-connection-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { Plus, CheckCircle, XCircle, Clock, AlertCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { FiMcpDashboard } from "@/components/fi-mcp-dashboard"
import { CombinedPortfolioDashboard } from "@/components/combined-portfolio-dashboard"

interface Connection {
  id: string
  provider_id: string
  provider_name: string
  display_name: string
  access_token: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])
  const [loadingConnections, setLoadingConnections] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [removingConnection, setRemovingConnection] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Add state for Fi MCP data
  const [fiMcpPortfolio, setFiMcpPortfolio] = useState(null)
  const [upstoxHoldings, setUpstoxHoldings] = useState(null)

  // Handle OAuth callback messages
  useEffect(() => {
    const error = searchParams.get("error")
    const success = searchParams.get("success")

    if (error) {
      toast.error(`Connection failed: ${error.replace(/_/g, " ")}`)
    }
    if (success === "connected") {
      toast.success("Upstox account connected successfully!")
      // Refresh connections after successful connection
      setTimeout(() => {
        fetchConnections()
      }, 1000)
    }
  }, [searchParams])

  const fetchConnections = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("user_connections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Get only the latest connection per provider
      const uniqueConnections =
        data?.reduce((acc: Connection[], current: Connection) => {
          const existingProvider = acc.find((conn) => conn.provider_id === current.provider_id)
          if (!existingProvider) {
            acc.push(current)
          }
          return acc
        }, []) || []

      setConnections(uniqueConnections)
    } catch (error) {
      console.error("Error fetching connections:", error)
    } finally {
      setLoadingConnections(false)
    }
  }

  const handleRemoveConnection = async (connectionId: string, providerName: string) => {
    if (!confirm(`Are you sure you want to disconnect your ${providerName} account?`)) {
      return
    }

    setRemovingConnection(connectionId)

    try {
      const { error } = await supabase.from("user_connections").delete().eq("id", connectionId)

      if (error) throw error

      toast.success(`${providerName} account disconnected successfully`)
      fetchConnections() // Refresh the connections list
    } catch (error) {
      console.error("Error removing connection:", error)
      toast.error("Failed to disconnect account. Please try again.")
    } finally {
      setRemovingConnection(null)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      setShowSignIn(true)
    }
  }, [user, loading])

  useEffect(() => {
    fetchConnections()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-3 w-3 text-emerald-600" />
      case "syncing":
        return <Clock className="h-3 w-3 text-blue-600" />
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-600" />
      default:
        return <XCircle className="h-3 w-3 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800"
      case "syncing":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
      case "error":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
      default:
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
    }
  }

  // Function to fetch Fi MCP data
  const fetchFiMcpData = async (passcode: string) => {
    try {
      const response = await fetch("/api/fi-mcp/portfolio", {
        headers: { Authorization: `Bearer ${passcode}` },
      })
      if (response.ok) {
        const data = await response.json()
        setFiMcpPortfolio(data)
      }
    } catch (error) {
      console.error("Failed to fetch Fi MCP data:", error)
    }
  }

  // Function to fetch Upstox data (you can extract this from UpstoxDashboard)
  const fetchUpstoxData = async (accessToken: string) => {
    try {
      const response = await fetch("/api/upstox/holdings", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUpstoxHoldings(data)
      }
    } catch (error) {
      console.error("Failed to fetch Upstox data:", error)
    }
  }

  const upstoxConnection = connections.find((c) => c.provider_id === "upstox")
  const fiMcpConnection = connections.find((c) => c.provider_id === "fi_mcp")
  const hasConnections = connections.length > 0

  // Fetch data when connections are available
  useEffect(() => {
    if (upstoxConnection?.status === "connected") {
      fetchUpstoxData(upstoxConnection.access_token)
    }
    if (fiMcpConnection?.status === "connected") {
      fetchFiMcpData(fiMcpConnection.access_token)
    }
  }, [upstoxConnection, fiMcpConnection])

  if (loading || loadingConnections) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-base font-bold mb-2">Sign in to view your dashboard</h1>
          <p className="text-xs text-muted-foreground mb-4">
            Access your personalized financial insights and portfolio data
          </p>
        </div>
        <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
      </div>
    )
  }

  // Show combined dashboard if both connections exist
  const showCombinedDashboard = upstoxConnection?.status === "connected" || fiMcpConnection?.status === "connected"

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Welcome back, {user.user_metadata?.full_name || "User"}!</h1>
          <p className="text-xs text-muted-foreground mt-1">Your personalized financial dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Connection Status - Only show one per provider */}
          {hasConnections && (
            <div className="flex items-center space-x-2">
              {connections.map((connection) => (
                <Badge
                  key={connection.provider_id}
                  variant="outline"
                  className={`${getStatusColor(connection.status)} text-xs px-2 py-1 border`}
                >
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(connection.status)}
                    <span>{connection.display_name}</span>
                    <span className="capitalize">
                      {connection.status === "connected" ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </Badge>
              ))}
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex flex-col space-y-1">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              size="sm"
              className="text-xs px-2 py-1 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-3 w-3 mr-1" />
              {hasConnections ? "Add Connection" : "Connect Upstox"}
            </Button>
            {hasConnections && (
              <Button
                onClick={() => {
                  const connection = connections[0] // Get the first (and likely only) connection
                  handleRemoveConnection(connection.id, connection.display_name)
                }}
                disabled={removingConnection !== null}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 dark:border-red-800 dark:text-red-400"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {removingConnection ? "Removing..." : "Remove Connection"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {!hasConnections ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-base font-bold mb-2">No connections found</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Connect your Upstox account to start building your digital twin and get personalized insights.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-xs px-3 py-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Connect Upstox Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {showCombinedDashboard && (
            <div className="mb-6">
              <CombinedPortfolioDashboard
                upstoxHoldings={upstoxHoldings}
                fiMcpPortfolio={fiMcpPortfolio}
                onRefresh={() => {
                  if (upstoxConnection?.status === "connected") {
                    fetchUpstoxData(upstoxConnection.access_token)
                  }
                  if (fiMcpConnection?.status === "connected") {
                    fetchFiMcpData(fiMcpConnection.access_token)
                  }
                }}
                isLoading={loadingConnections}
              />
            </div>
          )}

          {/* Individual dashboards for detailed view */}
          {upstoxConnection && upstoxConnection.status === "connected" && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-semibold mb-3">📊 Detailed Upstox View</summary>
              <UpstoxDashboard accessToken={upstoxConnection.access_token} />
            </details>
          )}

          {fiMcpConnection && fiMcpConnection.status === "connected" && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-semibold mb-3">🏦 Detailed Fi MCP View</summary>
              <FiMcpDashboard passcode={fiMcpConnection.access_token} />
            </details>
          )}

          {/* Show message if connection exists but not connected */}
          {upstoxConnection && upstoxConnection.status !== "connected" && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-400 mb-1">Connection Issue</h3>
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">
                  Your Upstox connection is {upstoxConnection.status}. Please reconnect to view your portfolio.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm" className="text-xs">
                  Reconnect Upstox
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <AddConnectionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onConnectionAdded={fetchConnections}
      />
    </div>
  )
}
