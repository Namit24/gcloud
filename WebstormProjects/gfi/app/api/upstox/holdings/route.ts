import { type NextRequest, NextResponse } from "next/server"
import { fetchUpstoxData } from "@/lib/oauth-utils"

export async function GET(request: NextRequest) {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get("authorization")
    const accessToken = authHeader?.replace("Bearer ", "")

    if (!accessToken) {
      return NextResponse.json({ error: "No access token provided" }, { status: 401 })
    }

    const holdingsData = await fetchUpstoxData("/portfolio/long-term-holdings", accessToken)
    return NextResponse.json(holdingsData.data)
  } catch (error) {
    console.error("Failed to fetch Upstox holdings:", error)
    return NextResponse.json({ error: "Failed to fetch holdings" }, { status: 500 })
  }
}
