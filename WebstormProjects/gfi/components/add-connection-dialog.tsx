"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { ExternalLink, Search, Shield, Zap } from "lucide-react"
import { toast } from "sonner"
import { getAllProviders } from "@/lib/oauth-providers"
import { FiMcpConnectionDialog } from "./fi-mcp-connection-dialog"

interface AddConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnectionAdded: () => void
}

export function AddConnectionDialog({ open, onOpenChange, onConnectionAdded }: AddConnectionDialogProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [showFiMcpDialog, setShowFiMcpDialog] = useState(false)

  const filteredProviders = getAllProviders().filter(
    (provider) =>
      provider.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleConnect = async (providerId: string) => {
    if (!user) {
      toast.error("Please sign in first")
      return
    }

    if (providerId === "fi_mcp") {
      setShowFiMcpDialog(true)
      onOpenChange(false)
      return
    }

    setIsConnecting(providerId)

    try {
      // Start OAuth flow
      const response = await fetch("/api/oauth/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to initiate OAuth flow")
      }

      const { authUrl } = await response.json()

      // Redirect to OAuth provider
      window.location.href = authUrl
    } catch (error) {
      console.error("OAuth initiation failed:", error)
      toast.error("Failed to connect. Please try again.")
      setIsConnecting(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Connect Your Financial Account</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Securely connect your Upstox account to build your comprehensive financial twin.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Security Notice - Fixed for dark mode */}
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Bank-level Security</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    All connections use OAuth 2.0 with 256-bit encryption. We never store your passwords.
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search for your financial provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Providers Grid */}
            <div className="space-y-3">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="border rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow bg-card"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{provider.displayName}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{provider.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {provider.dataTypes.map((dataType) => (
                          <Badge key={dataType} variant="outline" className="text-xs px-1 py-0">
                            {dataType}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleConnect(provider.id)}
                        disabled={isConnecting === provider.id}
                        className="w-full text-xs px-3 py-1"
                      >
                        {isConnecting === provider.id ? (
                          <>
                            <Zap className="h-3 w-3 mr-1 animate-pulse" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Connect {provider.displayName}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No providers found matching "{searchTerm}"</p>
              </div>
            )}

            {/* Coming Soon Notice - Fixed for dark mode */}
            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="text-center">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  More Providers Coming Soon
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  We're working on adding support for Zerodha, HDFC Bank, ICICI Bank, and Groww. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FiMcpConnectionDialog
        open={showFiMcpDialog}
        onOpenChange={setShowFiMcpDialog}
        onConnectionAdded={onConnectionAdded}
      />
    </>
  )
}
