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

    const positionsData = await fetchUpstoxData("/portfolio/short-term-positions", accessToken)
    return NextResponse.json(positionsData.data)
  } catch (error) {
    console.error("Failed to fetch Upstox positions:", error)
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 })
  }
}
