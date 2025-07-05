import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { connectionId } = await request.json()

    if (!connectionId) {
      return NextResponse.json({ error: "Connection ID is required" }, { status: 400 })
    }

    // Use service role client for sync operations
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Update connection status to syncing
    await supabaseAdmin
      .from("user_connections")
      .update({
        status: "syncing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", connectionId)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update connection status to connected
    await supabaseAdmin
      .from("user_connections")
      .update({
        status: "connected",
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", connectionId)

    return NextResponse.json({
      success: true,
      message: "Sync completed successfully",
      recordsCount: Math.floor(Math.random() * 500) + 100,
      lastSync: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
