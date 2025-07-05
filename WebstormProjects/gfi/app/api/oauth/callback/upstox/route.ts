import { type NextRequest, NextResponse } from "next/server"
import { upstoxProvider } from "@/lib/oauth-providers"
import { exchangeUpstoxCodeForToken } from "@/lib/oauth-utils"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/dashboard?error=missing_parameters", request.url))
    }

    // For Next.js 15 - cookies() is async and returns a Promise
    const cookieStore = await cookies()
    const storedState = cookieStore.get("oauth_state")?.value
    const storedProviderId = cookieStore.get("oauth_provider_id")?.value
    const storedUserId = cookieStore.get("oauth_user_id")?.value

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL("/dashboard?error=invalid_state", request.url))
    }

    if (!storedUserId) {
      return NextResponse.redirect(new URL("/dashboard?error=missing_user", request.url))
    }

    // Exchange authorization code for access token
    const tokenData = await exchangeUpstoxCodeForToken(upstoxProvider, code)

    if (!tokenData.access_token) {
      console.error("No access token received:", tokenData)
      return NextResponse.redirect(new URL("/dashboard?error=no_access_token", request.url))
    }

    // Calculate expiry date safely
    let expiresAt: string | null = null
    if (tokenData.expires_in && typeof tokenData.expires_in === "number" && tokenData.expires_in > 0) {
      try {
        expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      } catch (dateError) {
        console.warn("Invalid expires_in value, using default 24 hours:", tokenData.expires_in)
        expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    } else {
      // Default to 24 hours if no expires_in provided
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    // Use service role client to bypass RLS for OAuth operations
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // First, delete any existing connections for this user and provider to avoid duplicates
    await supabaseAdmin.from("user_connections").delete().eq("user_id", storedUserId).eq("provider_id", "upstox")

    // Then insert the new connection
    const { error: dbError } = await supabaseAdmin.from("user_connections").insert({
      user_id: storedUserId,
      provider_id: "upstox",
      provider_name: "upstox",
      display_name: "Upstox",
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || null,
      expires_at: expiresAt,
      status: "connected",
      metadata: tokenData,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.redirect(new URL("/dashboard?error=database_error", request.url))
    }

    const response = NextResponse.redirect(new URL("/dashboard?success=connected", request.url))

    // Clear OAuth cookies
    response.cookies.delete("oauth_state")
    response.cookies.delete("oauth_provider_id")
    response.cookies.delete("oauth_user_id")

    return response
  } catch (error) {
    console.error("Upstox OAuth callback error:", error)
    return NextResponse.redirect(new URL("/dashboard?error=callback_failed", request.url))
  }
}
