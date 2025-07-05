export interface Connection {
  id: string
  userId: string
  providerId: string
  providerName: string
  displayName: string
  status: "connected" | "disconnected" | "error" | "syncing"
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
  accounts?: ConnectedAccount[]
  // Database fields (snake_case)
  user_id: string
  provider_id: string // Now supports both 'upstox' and 'fi_mcp'
  provider_name: string
  display_name: string
  access_token: string // For Upstox: OAuth token, For Fi MCP: passcode
  refresh_token?: string
  expires_at?: string
  last_sync_at?: string
  created_at: string
  updated_at: string
}

export interface ConnectedAccount {
  id: string
  connectionId: string
  accountId: string
  accountType: string
  accountName: string
  balance?: number
  currency: string
  lastUpdated: Date
}

export interface SyncStatus {
  connectionId: string
  status: "idle" | "syncing" | "success" | "error"
  lastSync?: Date
  nextSync?: Date
  recordsCount?: number
  error?: string
}
