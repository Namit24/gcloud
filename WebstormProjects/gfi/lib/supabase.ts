import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_connections: {
        Row: {
          id: string
          user_id: string
          provider_id: string
          provider_name: string
          display_name: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          status: "connected" | "disconnected" | "error" | "syncing"
          last_sync_at: string | null
          created_at: string
          updated_at: string
          metadata: any | null
        }
        Insert: {
          id?: string
          user_id: string
          provider_id: string
          provider_name: string
          display_name: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          status?: "connected" | "disconnected" | "error" | "syncing"
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
          metadata?: any | null
        }
        Update: {
          id?: string
          user_id?: string
          provider_id?: string
          provider_name?: string
          display_name?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          status?: "connected" | "disconnected" | "error" | "syncing"
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
          metadata?: any | null
        }
      }
      portfolio_data: {
        Row: {
          id: string
          user_id: string
          connection_id: string
          data_type: "holdings" | "positions" | "funds" | "profile"
          data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          connection_id: string
          data_type: "holdings" | "positions" | "funds" | "profile"
          data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          connection_id?: string
          data_type?: "holdings" | "positions" | "funds" | "profile"
          data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
