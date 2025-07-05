import type { PortfolioHolding, PortfolioSummary, SectorAllocation, PortfolioHistoryPoint } from "@/types/portfolio"

export function calculatePortfolioSummary(holdings: PortfolioHolding[]): PortfolioSummary {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalInvested = holdings.reduce((sum, holding) => sum + holding.averagePrice * holding.quantity, 0)
  const totalPnl = totalValue - totalInvested
  const totalPnlPercentage = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const daysPnl = holdings.reduce((sum, holding) => sum + holding.dayChange * holding.quantity, 0)
  const daysPnlPercentage = totalValue > 0 ? (daysPnl / (totalValue - daysPnl)) * 100 : 0

  return {
    totalValue,
    totalInvested,
    totalPnl,
    totalPnlPercentage,
    daysPnl,
    daysPnlPercentage,
    holdings,
    lastUpdated: new Date(),
  }
}

export function calculateSectorAllocation(holdings: PortfolioHolding[]): SectorAllocation[] {
  const sectorMap = new Map<string, { value: number; holdings: number }>()
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)

  holdings.forEach((holding) => {
    const existing = sectorMap.get(holding.sector) || { value: 0, holdings: 0 }
    sectorMap.set(holding.sector, {
      value: existing.value + holding.marketValue,
      holdings: existing.holdings + 1,
    })
  })

  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#ec4899", // pink
    "#6b7280", // gray
  ]

  return Array.from(sectorMap.entries())
    .map(([sector, data], index) => ({
      sector,
      value: data.value,
      percentage: (data.value / totalValue) * 100,
      holdings: data.holdings,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.value - a.value)
}

export function getTopHoldings(holdings: PortfolioHolding[], count = 5): PortfolioHolding[] {
  return [...holdings].sort((a, b) => b.marketValue - a.marketValue).slice(0, count)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

// Mock data generator for testing
export function generateMockPortfolioData(): PortfolioHolding[] {
  const mockStocks = [
    { symbol: "RELIANCE", companyName: "Reliance Industries Ltd", sector: "Energy", exchange: "NSE" },
    { symbol: "TCS", companyName: "Tata Consultancy Services", sector: "IT", exchange: "NSE" },
    { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd", sector: "Banking", exchange: "NSE" },
    { symbol: "INFY", companyName: "Infosys Ltd", sector: "IT", exchange: "NSE" },
    { symbol: "HINDUNILVR", companyName: "Hindustan Unilever Ltd", sector: "FMCG", exchange: "NSE" },
    { symbol: "ICICIBANK", companyName: "ICICI Bank Ltd", sector: "Banking", exchange: "NSE" },
    { symbol: "BHARTIARTL", companyName: "Bharti Airtel Ltd", sector: "Telecom", exchange: "NSE" },
    { symbol: "ITC", companyName: "ITC Ltd", sector: "FMCG", exchange: "NSE" },
    { symbol: "KOTAKBANK", companyName: "Kotak Mahindra Bank", sector: "Banking", exchange: "NSE" },
    { symbol: "LT", companyName: "Larsen & Toubro Ltd", sector: "Infrastructure", exchange: "NSE" },
  ]

  return mockStocks.map((stock) => {
    const quantity = Math.floor(Math.random() * 100) + 10
    const averagePrice = Math.floor(Math.random() * 2000) + 500
    const currentPrice = averagePrice + (Math.random() - 0.5) * 200
    const dayChange = (Math.random() - 0.5) * 50

    return {
      symbol: stock.symbol,
      companyName: stock.companyName,
      quantity,
      averagePrice,
      currentPrice,
      marketValue: currentPrice * quantity,
      pnl: (currentPrice - averagePrice) * quantity,
      pnlPercentage: ((currentPrice - averagePrice) / averagePrice) * 100,
      dayChange,
      dayChangePercentage: (dayChange / (currentPrice - dayChange)) * 100,
      sector: stock.sector,
      exchange: stock.exchange,
      lastUpdated: new Date(),
    }
  })
}

export function generateMockHistoryData(days = 30): PortfolioHistoryPoint[] {
  const data: PortfolioHistoryPoint[] = []
  const baseValue = 500000
  let currentValue = baseValue

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Simulate market volatility
    const change = (Math.random() - 0.5) * 0.03 // ±3% daily change
    currentValue *= 1 + change

    const pnl = currentValue - baseValue
    const pnlPercentage = (pnl / baseValue) * 100

    data.push({
      date: date.toISOString().split("T")[0],
      value: currentValue,
      pnl,
      pnlPercentage,
    })
  }

  return data
}
