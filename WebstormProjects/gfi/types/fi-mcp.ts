export interface FiMcpConnection {
  id: string
  userId: string
  passcode: string
  status: "connected" | "disconnected" | "error" | "syncing"
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FiMcpAccount {
  account_id: string
  account_name: string
  account_type: "savings" | "current" | "credit_card" | "loan"
  bank_name: string
  balance: number
  currency: string
  last_updated: string
}

export interface FiMcpMutualFund {
  scheme_code: string
  scheme_name: string
  amc_name: string
  units: number
  nav: number
  current_value: number
  invested_amount: number
  pnl: number
  pnl_percentage: number
  sip_amount?: number
  sip_date?: string
  last_updated: string
}

export interface FiMcpTransaction {
  transaction_id: string
  account_id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
  category: string
  balance_after: number
}

export interface FiMcpPortfolio {
  accounts: FiMcpAccount[]
  mutual_funds: FiMcpMutualFund[]
  transactions: FiMcpTransaction[]
  total_balance: number
  total_investments: number
  total_pnl: number
}

export interface FiMcpProfile {
  user_id: string
  name: string
  email: string
  phone: string
  pan: string
  linked_accounts: number
  last_sync: string
}
