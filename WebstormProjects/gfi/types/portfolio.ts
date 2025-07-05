export interface PortfolioHolding {
  symbol: string
  companyName: string
  quantity: number
  averagePrice: number
  currentPrice: number
  marketValue: number
  pnl: number
  pnlPercentage: number
  dayChange: number
  dayChangePercentage: number
  sector: string
  exchange: string
  lastUpdated: Date
}

export interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalPnl: number
  totalPnlPercentage: number
  daysPnl: number
  daysPnlPercentage: number
  holdings: PortfolioHolding[]
  lastUpdated: Date
}

export interface PortfolioHistoryPoint {
  date: string
  value: number
  pnl: number
  pnlPercentage: number
}

export interface MarketDataUpdate {
  symbol: string
  price: number
  change: number
  changePercentage: number
  timestamp: Date
}

export type TimePeriod = "1D" | "1W" | "1M" | "3M" | "1Y"

export interface SectorAllocation {
  sector: string
  value: number
  percentage: number
  holdings: number
  color: string
}
