"use client"

import { supabase } from "@/lib/supabase"

export interface SyncJob {
  id: string
  userId: string
  providerId: string
  status: "pending" | "running" | "completed" | "failed"
  lastRun?: Date
  nextRun: Date
  frequency: "hourly" | "daily" | "weekly"
  metadata?: Record<string, any>
}

export class DataSyncScheduler {
  private static instance: DataSyncScheduler
  private syncJobs: Map<string, SyncJob> = new Map()
  private intervalId: NodeJS.Timeout | null = null

  static getInstance(): DataSyncScheduler {
    if (!DataSyncScheduler.instance) {
      DataSyncScheduler.instance = new DataSyncScheduler()
    }
    return DataSyncScheduler.instance
  }

  async startScheduler() {
    if (this.intervalId) return

    // Check for pending sync jobs every 5 minutes
    this.intervalId = setInterval(
      async () => {
        await this.processPendingSyncs()
      },
      5 * 60 * 1000,
    )

    console.log("Data sync scheduler started")
  }

  stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log("Data sync scheduler stopped")
    }
  }

  async scheduleSync(userId: string, providerId: string, frequency: "hourly" | "daily" | "weekly" = "daily") {
    const jobId = `${userId}_${providerId}`
    const nextRun = this.calculateNextRun(frequency)

    const syncJob: SyncJob = {
      id: jobId,
      userId,
      providerId,
      status: "pending",
      nextRun,
      frequency,
    }

    this.syncJobs.set(jobId, syncJob)

    // Store in database
    await supabase.from("sync_jobs").upsert({
      id: jobId,
      user_id: userId,
      provider_id: providerId,
      status: "pending",
      next_run: nextRun.toISOString(),
      frequency,
    })

    console.log(`Scheduled sync for ${providerId} (${frequency})`)
  }

  private calculateNextRun(frequency: "hourly" | "daily" | "weekly"): Date {
    const now = new Date()
    switch (frequency) {
      case "hourly":
        return new Date(now.getTime() + 60 * 60 * 1000)
      case "daily":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case "weekly":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }
  }

  private async processPendingSyncs() {
    const now = new Date()

    for (const [jobId, job] of this.syncJobs) {
      if (job.status === "pending" && job.nextRun <= now) {
        await this.executeSync(job)
      }
    }
  }

  private async executeSync(job: SyncJob) {
    try {
      job.status = "running"
      job.lastRun = new Date()

      // Update database
      await supabase
        .from("sync_jobs")
        .update({
          status: "running",
          last_run: job.lastRun.toISOString(),
        })
        .eq("id", job.id)

      // Execute the actual sync based on provider
      if (job.providerId === "upstox") {
        await this.syncUpstoxData(job.userId)
      } else if (job.providerId === "fi_mcp") {
        await this.syncFiMcpData(job.userId)
      }

      // Mark as completed and schedule next run
      job.status = "completed"
      job.nextRun = this.calculateNextRun(job.frequency)

      await supabase
        .from("sync_jobs")
        .update({
          status: "completed",
          next_run: job.nextRun.toISOString(),
        })
        .eq("id", job.id)

      console.log(`Sync completed for ${job.providerId}`)
    } catch (error) {
      console.error(`Sync failed for ${job.providerId}:`, error)
      job.status = "failed"

      await supabase
        .from("sync_jobs")
        .update({
          status: "failed",
          metadata: { error: error.message },
        })
        .eq("id", job.id)
    }
  }

  private async syncUpstoxData(userId: string) {
    // Get user's Upstox connection
    const { data: connection } = await supabase
      .from("user_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider_id", "upstox")
      .single()

    if (!connection) return

    // Fetch fresh data from Upstox API
    const headers = { Authorization: `Bearer ${connection.access_token}` }

    const [holdingsRes, positionsRes, fundsRes] = await Promise.all([
      fetch("/api/upstox/holdings", { headers }),
      fetch("/api/upstox/positions", { headers }),
      fetch("/api/upstox/funds", { headers }),
    ])

    // Store the synced data
    if (holdingsRes.ok) {
      const holdings = await holdingsRes.json()
      await supabase.from("portfolio_data").upsert({
        user_id: userId,
        connection_id: connection.id,
        data_type: "holdings",
        data: holdings,
      })
    }
  }

  private async syncFiMcpData(userId: string) {
    // Get user's Fi MCP connection
    const { data: connection } = await supabase
      .from("user_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider_id", "fi_mcp")
      .single()

    if (!connection) return

    // Fetch fresh data from Fi MCP API
    const headers = { Authorization: `Bearer ${connection.access_token}` }

    const portfolioRes = await fetch("/api/fi-mcp/portfolio", { headers })

    if (portfolioRes.ok) {
      const portfolio = await portfolioRes.json()
      await supabase.from("portfolio_data").upsert({
        user_id: userId,
        connection_id: connection.id,
        data_type: "portfolio",
        data: portfolio,
      })
    }
  }
}

// Export singleton instance
export const syncScheduler = DataSyncScheduler.getInstance()
