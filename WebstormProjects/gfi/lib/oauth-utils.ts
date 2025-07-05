import { randomBytes } from "crypto"

export function generateState(): string {
  return randomBytes(32).toString("hex")
}

export function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url")
}

export function generateCodeChallenge(verifier: string): string {
  const crypto = require("crypto")
  return crypto.createHash("sha256").update(verifier).digest("base64url")
}

export function buildAuthUrl(provider: any, state: string, codeChallenge?: string): string {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    scope: provider.scopes.join(" "),
    response_type: "code",
    state: state,
  })

  if (codeChallenge) {
    params.append("code_challenge", codeChallenge)
    params.append("code_challenge_method", "S256")
  }

  return `${provider.authUrl}?${params.toString()}`
}

export async function exchangeCodeForToken(provider: any, code: string, codeVerifier?: string): Promise<any> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: provider.clientId,
    client_secret: process.env[`${provider.name.toUpperCase()}_CLIENT_SECRET`] || "",
    code: code,
    redirect_uri: provider.redirectUri,
  })

  if (codeVerifier) {
    body.append("code_verifier", codeVerifier)
  }

  const response = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

export function buildUpstoxAuthUrl(provider: any, state: string): string {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: "code",
    state: state,
  })

  return `${provider.authUrl}?${params.toString()}`
}

export async function exchangeUpstoxCodeForToken(provider: any, code: string): Promise<any> {
  const body = new URLSearchParams({
    code: code,
    client_id: provider.clientId,
    client_secret: process.env.UPSTOX_CLIENT_SECRET || "",
    redirect_uri: provider.redirectUri,
    grant_type: "authorization_code",
  })

  const response = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upstox token exchange failed: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// Upstox API helper functions
export async function fetchUpstoxData(endpoint: string, accessToken: string): Promise<any> {
  const response = await fetch(`https://api.upstox.com/v2${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Upstox API error: ${response.status}`)
  }

  return response.json()
}
