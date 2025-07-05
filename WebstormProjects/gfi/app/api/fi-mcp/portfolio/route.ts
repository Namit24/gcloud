import { type NextRequest, NextResponse } from "next/server"
import type { FiMcpPortfolio } from "@/types/fi-mcp"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const passcode = authHeader?.replace("Bearer ", "")

    if (!passcode) {
      return NextResponse.json({ error: "No passcode provided" }, { status: 401 })
    }

    // Mock Fi MCP portfolio data (replace with actual Fi MCP API call)
    const portfolioData: FiMcpPortfolio = {
      accounts: [
        {
          account_id: "acc_001",
          account_name: "HDFC Savings",
          account_type: "savings",
          bank_name: "HDFC Bank",
          balance: 125000,
          currency: "INR",
          last_updated: new Date().toISOString(),
        },
        {
          account_id: "acc_002",
          account_name: "ICICI Current",
          account_type: "current",
          bank_name: "ICICI Bank",
          balance: 75000,
          currency: "INR",
          last_updated: new Date().toISOString(),
        },
        {
          account_id: "acc_003",
          account_name: "SBI Credit Card",
          account_type: "credit_card",
          bank_name: "State Bank of India",
          balance: -25000,
          currency: "INR",
          last_updated: new Date().toISOString(),
        },
      ],
      mutual_funds: [
        {
          scheme_code: "MF001",
          scheme_name: "SBI Bluechip Fund",
          amc_name: "SBI Mutual Fund",
          units: 1250.75,
          nav: 85.42,
          current_value: 106850,
          invested_amount: 100000,
          pnl: 6850,
          pnl_percentage: 6.85,
          sip_amount: 5000,
          sip_date: "5",
          last_updated: new Date().toISOString(),
        },
        {
          scheme_code: "MF002",
          scheme_name: "HDFC Mid Cap Opportunities",
          amc_name: "HDFC Mutual Fund",
          units: 890.25,
          nav: 112.75,
          current_value: 100425,
          invested_amount: 95000,
          pnl: 5425,
          pnl_percentage: 5.71,
          sip_amount: 3000,
          sip_date: "10",
          last_updated: new Date().toISOString(),
        },
        {
          scheme_code: "MF003",
          scheme_name: "Axis Small Cap Fund",
          amc_name: "Axis Mutual Fund",
          units: 675.5,
          nav: 95.8,
          current_value: 64715,
          invested_amount: 70000,
          pnl: -5285,
          pnl_percentage: -7.55,
          sip_amount: 2000,
          sip_date: "15",
          last_updated: new Date().toISOString(),
        },
      ],
      transactions: [
        {
          transaction_id: "txn_001",
          account_id: "acc_001",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Salary Credit",
          amount: 85000,
          type: "credit",
          category: "Salary",
          balance_after: 125000,
        },
        {
          transaction_id: "txn_002",
          account_id: "acc_001",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: "SIP - SBI Bluechip Fund",
          amount: -5000,
          type: "debit",
          category: "Investment",
          balance_after: 40000,
        },
        {
          transaction_id: "txn_003",
          account_id: "acc_002",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Online Purchase",
          amount: -2500,
          type: "debit",
          category: "Shopping",
          balance_after: 75000,
        },
      ],
      total_balance: 175000, // Sum of all account balances (excluding credit card debt)
      total_investments: 271990, // Sum of all mutual fund current values
      total_pnl: 6990, // Sum of all mutual fund P&L
    }

    return NextResponse.json(portfolioData)
  } catch (error) {
    console.error("Failed to fetch Fi MCP portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
