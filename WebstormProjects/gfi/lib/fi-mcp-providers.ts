export interface FiMcpProvider {
  id: string
  name: string
  displayName: string
  description: string
  logo: string
  category: "aggregator"
  authType: "passcode"
  dataTypes: string[]
}

export const fiMcpProvider: FiMcpProvider = {
  id: "fi_mcp",
  name: "fi_mcp",
  displayName: "Fi MCP",
  description: "Connect your comprehensive financial data including bank accounts, mutual funds, and transactions",
  logo: "/fi-mcp-logo.png",
  category: "aggregator",
  authType: "passcode",
  dataTypes: ["Bank Accounts", "Mutual Funds", "Transactions", "Credit Cards", "Loans", "SIP Investments"],
}

export function getFiMcpProvider(): FiMcpProvider {
  return fiMcpProvider
}
