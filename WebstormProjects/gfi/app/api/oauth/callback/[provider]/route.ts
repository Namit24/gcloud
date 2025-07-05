import { type NextRequest, NextResponse } from "next/server"
import { getProviderById } from "@/lib/oauth-providers"
import { exchangeCodeForToken } from "@/lib/oauth-utils"

export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(new URL(`/connections?error=${encodeURIComponent(error)}`, request.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/connections?error=missing_parameters", request.url))
    }

    // Verify state parameter
    const storedState = request.cookies.get("oauth_state")?.value
    const storedCodeVerifier = request.cookies.get("oauth_code_verifier")?.value
    const storedProviderId = request.cookies.get("oauth_provider_id")?.value

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL("/connections?error=invalid_state", request.url))
    }

    if (storedProviderId !== params.provider) {
      return NextResponse.redirect(new URL("/connections?error=provider_mismatch", request.url))
    }

    const provider = getProviderById(params.provider)
    if (!provider) {
      return NextResponse.redirect(new URL("/connections?error=provider_not_found", request.url))
    }

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForToken(provider, code, storedCodeVerifier)

    // Store connection in database
    // For demo purposes, we'll just redirect with success
    // In production, save the connection to your database here

    const response = NextResponse.redirect(new URL("/connections?success=connected", request.url))

    // Clear OAuth cookies
    response.cookies.delete("oauth_state")
    response.cookies.delete("oauth_code_verifier")
    response.cookies.delete("oauth_provider_id")

    return response
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(new URL("/connections?error=callback_failed", request.url))
  }
}
