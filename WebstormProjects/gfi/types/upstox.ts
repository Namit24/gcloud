export interface UpstoxConnection {
  id: string
  userId: string
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
  status: "connected" | "disconnected" | "error" | "syncing"
}

export interface UpstoxHolding {
  isin: string
  cnc_used_quantity: number
  collateral_quantity: number
  company_name: string
  haircut: number
  product: string
  quantity: number
  tradingsymbol: string
  last_price: number
  close_price: number
  pnl: number
  day_change: number
  day_change_percentage: number
  instrument_token: string
  average_price: number
  collateral_type: string
  t1_quantity: number
  exchange: string
}

export interface UpstoxPosition {
  exchange: string
  multiplier: number
  value: number
  pnl: number
  product: string
  instrument_token: string
  average_price: number
  buy_value: number
  overnight_quantity: number
  day_buy_value: number
  day_buy_price: number
  overnight_buy_amount: number
  overnight_buy_quantity: number
  day_buy_quantity: number
  day_sell_value: number
  day_sell_price: number
  overnight_sell_amount: number
  overnight_sell_quantity: number
  day_sell_quantity: number
  quantity: number
  last_price: number
  unrealised: number
  realised: number
  sell_value: number
  tradingsymbol: string
  close_price: number
  buy_price: number
  sell_price: number
}

export interface UpstoxFunds {
  equity: {
    available_margin: number
    used_margin: number
    payin_amount: number
    span_margin: number
    adhoc_margin: number
    notional_cash: number
    additional_margin: number
    unrealised: number
    realised: number
  }
}

export interface UpstoxProfile {
  client_id: string
  client_name: string
  email: string
  exchanges: string[]
  products: string[]
  broker: string
  user_id: string
  user_name: string
  user_shortname: string
  avatar_url: string
}
