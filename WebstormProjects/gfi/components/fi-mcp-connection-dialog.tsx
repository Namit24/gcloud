"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { Shield, Loader2, Key } from "lucide-react"
import { toast } from "sonner"

interface FiMcpConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnectionAdded: () => void
}

export function FiMcpConnectionDialog({ open, onOpenChange, onConnectionAdded }: FiMcpConnectionDialogProps) {
  const { user } = useAuth()
  const [passcode, setPasscode] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please sign in first")
      return
    }

    if (!passcode || passcode.length !== 6) {
      toast.error("Please enter a valid 6-digit passcode")
      return
    }

    setIsConnecting(true)

    try {
      const response = await fetch("/api/fi-mcp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, userId: user.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Connection failed")
      }

      const result = await response.json()
      toast.success("Fi MCP connected successfully!")
      onConnectionAdded()
      onOpenChange(false)
      setPasscode("")
    } catch (error: any) {
      console.error("Fi MCP connection failed:", error)
      toast.error(error.message || "Failed to connect. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Connect Fi MCP</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter your Fi MCP passcode to connect your comprehensive financial data.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Secure Connection</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Your passcode is encrypted and used only for authentication. We never store your credentials.
                </p>
              </div>
            </div>
          </div>

          {/* Fi MCP Info */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">Fi</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Fi MCP Integration</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Access your bank accounts, mutual funds, and transaction history
                </p>
                <div className="flex flex-wrap gap-1">
                  {["Bank Accounts", "Mutual Funds", "Transactions", "SIP Data"].map((dataType) => (
                    <Badge key={dataType} variant="outline" className="text-xs px-1 py-0">
                      {dataType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Passcode Form */}
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode" className="text-sm">
                Fi MCP Passcode
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passcode"
                  type="password"
                  placeholder="Enter 6-digit passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="pl-10 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit passcode provided by your Fi MCP administrator
              </p>
            </div>

            <Button
              type="submit"
              disabled={isConnecting || passcode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Connect Fi MCP
                </>
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Don't have a Fi MCP passcode?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Contact your administrator
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
