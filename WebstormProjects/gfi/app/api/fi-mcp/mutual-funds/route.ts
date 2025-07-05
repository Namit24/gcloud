import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const passcode = authHeader?.replace("Bearer ", "")

    if (!passcode) {
      return NextResponse.json({ error: "No passcode provided" }, { status: 401 })
    }

    // Mock mutual funds data
    const mutualFunds = [
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
    ]

    return NextResponse.json(mutualFunds)
  } catch (error) {
    console.error("Failed to fetch Fi MCP mutual funds:", error)
    return NextResponse.json({ error: "Failed to fetch mutual funds" }, { status: 500 })
  }
}
