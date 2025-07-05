import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const passcode = authHeader?.replace("Bearer ", "")

    if (!passcode) {
      return NextResponse.json({ error: "No passcode provided" }, { status: 401 })
    }

    // Mock bank accounts data
    const accounts = [
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
    ]

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Failed to fetch Fi MCP accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}
