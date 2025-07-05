export interface OAuthProvider {
  id: string
  name: string
  displayName: string
  description: string
  logo: string
  category: "broker" | "bank" | "credit"
  authUrl: string
  tokenUrl: string
  apiBaseUrl: string
  scopes: string[]
  clientId: string
  redirectUri: string
  dataTypes: string[]
}

export const upstoxProvider: OAuthProvider = {
  id: "upstox",
  name: "upstox",
  displayName: "Upstox",
  description: "Connect your Upstox trading and investment account for portfolio analysis",
  logo: "/upstox-logo.png",
  category: "broker",
  authUrl: "https://api.upstox.com/v2/login/authorization/dialog",
  tokenUrl: "https://api.upstox.com/v2/login/authorization/token",
  apiBaseUrl: "https://api.upstox.com/v2",
  scopes: [], // Upstox doesn't use traditional scopes
  clientId: process.env.UPSTOX_CLIENT_ID || "",
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback/upstox`,
  dataTypes: ["Portfolio Holdings", "Trading History", "P&L Reports", "Market Positions", "Fund Details"],
}

import { getFiMcpProvider } from "./fi-mcp-providers"

// Add Fi MCP to the existing providers array
export const oauthProviders: OAuthProvider[] = [upstoxProvider]

// Create a new combined providers array that includes both OAuth and Fi MCP
export const allProviders = [...oauthProviders, getFiMcpProvider()]

export function getAllProviders() {
  return allProviders
}

export function getProviderById(id: string): OAuthProvider | undefined {
  return oauthProviders.find((provider) => provider.id === id)
}
