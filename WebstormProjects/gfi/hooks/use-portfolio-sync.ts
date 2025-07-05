"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { syncScheduler } from "@/lib/data-sync-scheduler"
import { toast } from "sonner"

export function usePortfolioSync() {
  const { user } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Start the sync scheduler when user is authenticated
      syncScheduler.startScheduler()
    }

    return () => {
      // Clean up scheduler when component unmounts
      syncScheduler.stopScheduler()
    }
  }, [user])

  const syncPortfolio = async (providerId: string, frequency: "hourly" | "daily" | "weekly" = "daily") => {
    if (!user) {
      toast.error("Please sign in to sync your portfolio")
      return false
    }

    setIsSyncing(true)
    setSyncError(null)

    try {
      const response = await fetch("/api/portfolio/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          providerId,
          frequency,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Sync failed")
      }

      const result = await response.json()
      setLastSyncTime(new Date(result.lastSync))
      toast.success(`Portfolio synced successfully! ${result.recordsCount} records updated.`)
      return true
    } catch (error: any) {
      console.error("Portfolio sync error:", error)
      setSyncError(error.message)
      toast.error(`Sync failed: ${error.message}`)
      return false
    } finally {
      setIsSyncing(false)
    }
  }

  const syncAllProviders = async () => {
    if (!user) return false

    const providers = ["upstox", "fi_mcp"]
    let successCount = 0

    for (const providerId of providers) {
      const success = await syncPortfolio(providerId)
      if (success) successCount++
    }

    if (successCount > 0) {
      toast.success(`Synced ${successCount} provider(s) successfully`)
    }

    return successCount === providers.length
  }

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    syncPortfolio,
    syncAllProviders,
  }
}
