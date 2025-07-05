import { type NextRequest, NextResponse } from "next/server"
import { getProviderById } from "@/lib/oauth-providers"
import { generateState, buildUpstoxAuthUrl } from "@/lib/oauth-utils"

export async function POST(request: NextRequest) {
  try {
    const { providerId, userId } = await request.json()

    if (!providerId || !userId) {
      return NextResponse.json({ error: "Provider ID and User ID are required" }, { status: 400 })
    }

    const provider = getProviderById(providerId)
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    // Debug logging
    console.log("OAuth Debug Info:", {
      clientId: provider.clientId,
      redirectUri: provider.redirectUri,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    })

    // Generate OAuth state
    const state = generateState()

    // Store state and user info in session
    const response = NextResponse.json({
      authUrl: buildUpstoxAuthUrl(provider, state),
      debug: {
        clientId: provider.clientId,
        redirectUri: provider.redirectUri,
      },
    })

    // Set secure cookies for OAuth state management
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    })

    response.cookies.set("oauth_provider_id", providerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    })

    response.cookies.set("oauth_user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    })

    return response
  } catch (error) {
    console.error("OAuth initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
