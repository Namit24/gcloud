import type { UpstoxHolding, UpstoxFunds } from "@/types/upstox"
import type { PortfolioHolding, PortfolioSummary } from "@/types/portfolio"

// Map Upstox sectors to standardized sectors
const SECTOR_MAPPING: Record<string, string> = {
  "FINANCIAL SERVICES": "Banking",
  "INFORMATION TECHNOLOGY": "IT",
  "CONSUMER GOODS": "FMCG",
  AUTOMOBILE: "Auto",
  PHARMACEUTICALS: "Pharma",
  ENERGY: "Energy",
  METALS: "Metals",
  TELECOM: "Telecom",
  INFRASTRUCTURE: "Infrastructure",
  TEXTILES: "Textiles",
}

export function convertUpstoxToPortfolioHolding(upstoxHolding: UpstoxHolding): PortfolioHolding {
  const marketValue = upstoxHolding.quantity * upstoxHolding.last_price
  const investedValue = upstoxHolding.quantity * upstoxHolding.average_price
  const pnl = marketValue - investedValue
  const pnlPercentage = investedValue > 0 ? (pnl / investedValue) * 100 : 0

  // Calculate day change
  const dayChange = upstoxHolding.last_price - upstoxHolding.close_price
  const dayChangePercentage = upstoxHolding.close_price > 0 ? (dayChange / upstoxHolding.close_price) * 100 : 0

  // Determine sector - you might need to enhance this based on Upstox data structure
  const sector =
    SECTOR_MAPPING[upstoxHolding.company_name?.toUpperCase()] ||
    determineSectorFromSymbol(upstoxHolding.tradingsymbol) ||
    "Others"

  return {
    symbol: upstoxHolding.tradingsymbol,
    companyName: upstoxHolding.company_name,
    quantity: upstoxHolding.quantity,
    averagePrice: upstoxHolding.average_price,
    currentPrice: upstoxHolding.last_price,
    marketValue,
    pnl,
    pnlPercentage,
    dayChange,
    dayChangePercentage,
    sector,
    exchange: upstoxHolding.exchange,
    lastUpdated: new Date(),
  }
}

export function convertUpstoxToPortfolioSummary(holdings: UpstoxHolding[], funds?: UpstoxFunds): PortfolioSummary {
  const portfolioHoldings = holdings.map(convertUpstoxToPortfolioHolding)

  const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalInvested = portfolioHoldings.reduce((sum, holding) => sum + holding.averagePrice * holding.quantity, 0)
  const totalPnl = totalValue - totalInvested
  const totalPnlPercentage = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0

  const daysPnl = portfolioHoldings.reduce((sum, holding) => sum + holding.dayChange * holding.quantity, 0)
  const daysPnlPercentage = totalValue > 0 ? (daysPnl / (totalValue - daysPnl)) * 100 : 0

  return {
    totalValue,
    totalInvested,
    totalPnl,
    totalPnlPercentage,
    daysPnl,
    daysPnlPercentage,
    holdings: portfolioHoldings,
    lastUpdated: new Date(),
  }
}

function determineSectorFromSymbol(symbol: string): string {
  // Basic sector mapping based on common stock symbols
  const sectorMap: Record<string, string> = {
    HDFCBANK: "Banking",
    ICICIBANK: "Banking",
    KOTAKBANK: "Banking",
    SBIN: "Banking",
    AXISBANK: "Banking",
    TCS: "IT",
    INFY: "IT",
    WIPRO: "IT",
    TECHM: "IT",
    HCLTECH: "IT",
    RELIANCE: "Energy",
    ONGC: "Energy",
    BPCL: "Energy",
    IOC: "Energy",
    HINDUNILVR: "FMCG",
    ITC: "FMCG",
    NESTLEIND: "FMCG",
    BRITANNIA: "FMCG",
    MARUTI: "Auto",
    TATAMOTORS: "Auto",
    "M&M": "Auto",
    "BAJAJ-AUTO": "Auto",
    BHARTIARTL: "Telecom",
    IDEA: "Telecom",
    DRREDDY: "Pharma",
    SUNPHARMA: "Pharma",
    CIPLA: "Pharma",
    LT: "Infrastructure",
    ULTRACEMCO: "Infrastructure",
    TATASTEEL: "Metals",
    HINDALCO: "Metals",
    JSWSTEEL: "Metals",
  }

  return sectorMap[symbol] || "Others"
}

export function generatePortfolioHistoryFromUpstox(
  currentHoldings: UpstoxHolding[],
  days = 30,
): Array<{ date: string; value: number; pnl: number; pnlPercentage: number }> {
  const history = []
  const currentValue = currentHoldings.reduce((sum, h) => sum + h.quantity * h.last_price, 0)
  const investedValue = currentHoldings.reduce((sum, h) => sum + h.quantity * h.average_price, 0)

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Simulate historical values based on current data
    // In production, you'd fetch actual historical data
    const volatility = 0.02 // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * volatility
    const dayValue = currentValue * (1 + randomChange * (i / days))

    const pnl = dayValue - investedValue
    const pnlPercentage = investedValue > 0 ? (pnl / investedValue) * 100 : 0

    history.push({
      date: date.toISOString().split("T")[0],
      value: dayValue,
      pnl,
      pnlPercentage,
    })
  }

  return history
}
