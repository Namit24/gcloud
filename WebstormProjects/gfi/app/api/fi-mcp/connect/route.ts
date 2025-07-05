import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { passcode, userId } = await request.json()

    if (!passcode || !userId) {
      return NextResponse.json({ error: "Passcode and User ID are required" }, { status: 400 })
    }

    // Validate passcode format (Fi MCP typically uses 6-digit passcode)
    if (!/^\d{6}$/.test(passcode)) {
      return NextResponse.json({ error: "Invalid passcode format. Please enter a 6-digit passcode." }, { status: 400 })
    }

    // Use service role client for connection operations
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Delete any existing Fi MCP connections for this user
    await supabaseAdmin.from("user_connections").delete().eq("user_id", userId).eq("provider_id", "fi_mcp")

    // Create new Fi MCP connection
    const { error: dbError } = await supabaseAdmin.from("user_connections").insert({
      user_id: userId,
      provider_id: "fi_mcp",
      provider_name: "fi_mcp",
      display_name: "Fi MCP",
      access_token: passcode, // Store passcode as access token
      status: "connected",
      metadata: {
        auth_type: "passcode",
        connected_at: new Date().toISOString(),
      },
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save connection" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Fi MCP connected successfully",
      provider: "fi_mcp",
    })
  } catch (error) {
    console.error("Fi MCP connection error:", error)
    return NextResponse.json({ error: "Connection failed" }, { status: 500 })
  }
}
