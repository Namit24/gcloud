import type { PortfolioHolding } from "@/types/portfolio"
import type { FiMcpPortfolio } from "@/types/fi-mcp"
import type { UpstoxHolding } from "@/types/upstox"

export interface CombinedPortfolio {
  totalNetWorth: number
  totalTradingValue: number
  totalInvestments: number
  totalCash: number
  totalPnl: number
  totalDayChange: number
  upstoxData?: {
    holdings: UpstoxHolding[]
    totalValue: number
    totalPnl: number
  }
  fiMcpData?: {
    accounts: any[]
    mutualFunds: any[]
    totalBalance: number
    totalInvestments: number
    totalPnl: number
  }
  combinedHoldings: PortfolioHolding[]
}

export function mergePortfolioData(
  upstoxHoldings?: UpstoxHolding[],
  fiMcpPortfolio?: FiMcpPortfolio,
): CombinedPortfolio {
  // Calculate Upstox totals
  const upstoxTotalValue = upstoxHoldings?.reduce((sum, holding) => sum + holding.quantity * holding.last_price, 0) || 0
  const upstoxTotalPnl = upstoxHoldings?.reduce((sum, holding) => sum + holding.pnl, 0) || 0

  // Calculate Fi MCP totals
  const fiMcpTotalBalance = fiMcpPortfolio?.total_balance || 0
  const fiMcpTotalInvestments = fiMcpPortfolio?.total_investments || 0
  const fiMcpTotalPnl = fiMcpPortfolio?.total_pnl || 0

  // Calculate combined totals
  const totalNetWorth = upstoxTotalValue + fiMcpTotalBalance + fiMcpTotalInvestments
  const totalPnl = upstoxTotalPnl + fiMcpTotalPnl

  // Convert holdings to unified format
  const combinedHoldings: PortfolioHolding[] = []

  // Add Upstox holdings
  if (upstoxHoldings) {
    upstoxHoldings.forEach((holding) => {
      combinedHoldings.push({
        symbol: holding.tradingsymbol,
        companyName: holding.company_name,
        quantity: holding.quantity,
        averagePrice: holding.average_price,
        currentPrice: holding.last_price,
        marketValue: holding.quantity * holding.last_price,
        pnl: holding.pnl,
        pnlPercentage: holding.day_change_percentage,
        dayChange: holding.day_change,
        dayChangePercentage: holding.day_change_percentage,
        sector: "Trading", // Mark as trading
        exchange: holding.exchange,
        lastUpdated: new Date(),
      })
    })
  }

  // Add Fi MCP mutual funds as holdings
  if (fiMcpPortfolio?.mutual_funds) {
    fiMcpPortfolio.mutual_funds.forEach((fund) => {
      combinedHoldings.push({
        symbol: fund.scheme_code,
        companyName: fund.scheme_name,
        quantity: fund.units,
        averagePrice: fund.invested_amount / fund.units,
        currentPrice: fund.nav,
        marketValue: fund.current_value,
        pnl: fund.pnl,
        pnlPercentage: fund.pnl_percentage,
        dayChange: 0, // Mutual funds don't have daily changes
        dayChangePercentage: 0,
        sector: "Mutual Fund", // Mark as mutual fund
        exchange: fund.amc_name,
        lastUpdated: new Date(fund.last_updated),
      })
    })
  }

  return {
    totalNetWorth,
    totalTradingValue: upstoxTotalValue,
    totalInvestments: fiMcpTotalInvestments,
    totalCash: fiMcpTotalBalance,
    totalPnl,
    totalDayChange: upstoxHoldings?.reduce((sum, holding) => sum + holding.quantity * holding.day_change, 0) || 0,
    upstoxData: upstoxHoldings
      ? {
          holdings: upstoxHoldings,
          totalValue: upstoxTotalValue,
          totalPnl: upstoxTotalPnl,
        }
      : undefined,
    fiMcpData: fiMcpPortfolio
      ? {
          accounts: fiMcpPortfolio.accounts,
          mutualFunds: fiMcpPortfolio.mutual_funds,
          totalBalance: fiMcpTotalBalance,
          totalInvestments: fiMcpTotalInvestments,
          totalPnl: fiMcpTotalPnl,
        }
      : undefined,
    combinedHoldings,
  }
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
