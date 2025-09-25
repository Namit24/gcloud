"use client"

import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  date: string
  description: string
  amount: number
  category: string
}

interface AnalysisData {
  openingBalance: number
  closingBalance: number
  totalIncome: number
  totalExpenses: number
  transactions: Transaction[]
  categories: Record<string, number>
  insights: string[]
}

interface AnalysisChartsProps {
  data: AnalysisData
}

export function AnalysisCharts({ data }: AnalysisChartsProps) {
  // Guard: no transactions
  if (!data?.transactions || data.transactions.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Monthly Spend vs Earn</CardTitle>
          <CardDescription>Upload statements to see daily income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-xs text-muted-foreground">
            No transactions available.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Find most recent month present in data
  const dates = data.transactions.map((t) => new Date(t.date))
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())))
  const year = latest.getFullYear()
  const month = latest.getMonth() // 0-11
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)
  const daysInMonth = monthEnd.getDate()

  // Build daily totals for the latest month only (real data only)
  const daily = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dayStart = new Date(year, month, day)
    const sameDay = data.transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })

    const income = sameDay.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
    const expenses = sameDay.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

    return {
      day,
      dateLabel: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      income,
      expenses,
    }
  })

  // Cumulative net within the month
  let running = 0
  const chartData = daily.map((d) => {
    running += d.income - d.expenses
    return { ...d, net: running }
  })

  const monthLabel = monthStart.toLocaleString(undefined, { month: "long", year: "numeric" })

  const totalIncomeMonth = chartData.reduce((s, d) => s + d.income, 0)
  const totalExpensesMonth = chartData.reduce((s, d) => s + d.expenses, 0)

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Monthly Spend vs Earn — {monthLabel}</CardTitle>
        <CardDescription>
          Income: {formatCurrency(totalIncomeMonth)} • Expenses: {formatCurrency(totalExpensesMonth)} • Net:{" "}
          {formatCurrency(totalIncomeMonth - totalExpensesMonth)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(d) => String(d)} />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "net" ? "Cumulative Net" : name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload
                  return p?.dateLabel || ""
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="income" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} name="Income" />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.25}
                name="Expenses"
              />
              <Line type="monotone" dataKey="net" stroke="#2563eb" strokeWidth={2} name="Cumulative Net" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
