import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { syncScheduler } from "@/lib/data-sync-scheduler"

export async function POST(request: NextRequest) {
  try {
    const { userId, providerId, frequency = "daily" } = await request.json()

    if (!userId || !providerId) {
      return NextResponse.json({ error: "User ID and Provider ID are required" }, { status: 400 })
    }

    // Schedule automatic sync
    await syncScheduler.scheduleSync(userId, providerId, frequency)

    // Perform immediate sync
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get user's connection
    const { data: connection } = await supabaseAdmin
      .from("user_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider_id", providerId)
      .single()

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    // Update connection status to syncing
    await supabaseAdmin
      .from("user_connections")
      .update({
        status: "syncing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id)

    // Perform sync based on provider
    let syncResult = { recordsCount: 0, lastSync: new Date().toISOString() }

    if (providerId === "upstox") {
      syncResult = await syncUpstoxData(connection)
    } else if (providerId === "fi_mcp") {
      syncResult = await syncFiMcpData(connection)
    }

    // Update connection status to connected
    await supabaseAdmin
      .from("user_connections")
      .update({
        status: "connected",
        last_sync_at: syncResult.lastSync,
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id)

    return NextResponse.json({
      success: true,
      message: "Sync completed successfully",
      ...syncResult,
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}

async function syncUpstoxData(connection: any) {
  const headers = { Authorization: `Bearer ${connection.access_token}` }
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    // Fetch data from Upstox APIs
    const [holdingsRes, positionsRes, fundsRes, profileRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upstox/holdings`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upstox/positions`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upstox/funds`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upstox/profile`, { headers }),
    ])

    let recordsCount = 0

    // Store holdings data
    if (holdingsRes.ok) {
      const holdings = await holdingsRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "holdings",
        data: holdings,
      })
      recordsCount += Array.isArray(holdings) ? holdings.length : 0
    }

    // Store positions data
    if (positionsRes.ok) {
      const positions = await positionsRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "positions",
        data: positions,
      })
      recordsCount += Array.isArray(positions) ? positions.length : 0
    }

    // Store funds data
    if (fundsRes.ok) {
      const funds = await fundsRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "funds",
        data: funds,
      })
      recordsCount += 1
    }

    // Store profile data
    if (profileRes.ok) {
      const profile = await profileRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "profile",
        data: profile,
      })
      recordsCount += 1
    }

    return { recordsCount, lastSync: new Date().toISOString() }
  } catch (error) {
    console.error("Upstox sync error:", error)
    throw error
  }
}

async function syncFiMcpData(connection: any) {
  const headers = { Authorization: `Bearer ${connection.access_token}` }
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    // Fetch data from Fi MCP APIs
    const [portfolioRes, accountsRes, mutualFundsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/fi-mcp/portfolio`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/fi-mcp/accounts`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/fi-mcp/mutual-funds`, { headers }),
    ])

    let recordsCount = 0

    // Store portfolio data
    if (portfolioRes.ok) {
      const portfolio = await portfolioRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "portfolio",
        data: portfolio,
      })
      recordsCount += 1
    }

    // Store accounts data
    if (accountsRes.ok) {
      const accounts = await accountsRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "accounts",
        data: accounts,
      })
      recordsCount += Array.isArray(accounts) ? accounts.length : 0
    }

    // Store mutual funds data
    if (mutualFundsRes.ok) {
      const mutualFunds = await mutualFundsRes.json()
      await supabaseAdmin.from("portfolio_data").upsert({
        user_id: connection.user_id,
        connection_id: connection.id,
        data_type: "mutual_funds",
        data: mutualFunds,
      })
      recordsCount += Array.isArray(mutualFunds) ? mutualFunds.length : 0
    }

    return { recordsCount, lastSync: new Date().toISOString() }
  } catch (error) {
    console.error("Fi MCP sync error:", error)
    throw error
  }
}
