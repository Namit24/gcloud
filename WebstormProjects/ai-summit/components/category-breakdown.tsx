"use client"

import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryBreakdownProps {
  categories: Record<string, number>
  totalExpenses: number
}

export default function CategoryBreakdown({ categories, totalExpenses }: CategoryBreakdownProps) {
  console.log("[v0] CategoryBreakdown received categories:", categories)
  console.log("[v0] CategoryBreakdown received totalExpenses:", totalExpenses)

  const expenseCategories = Object.entries(categories)
    .filter(([category]) => category !== "Income")
    .sort(([, a], [, b]) => b - a)

  console.log("[v0] Filtered expense categories:", expenseCategories)

  const pieData = expenseCategories.map(([category, amount], index) => ({
    name: category,
    value: amount,
    percentage: ((amount / totalExpenses) * 100).toFixed(1),
    color: getCategoryColor(index),
  }))

  console.log("[v0] Pie chart data:", pieData)

  function getCategoryColor(index: number) {
    const colors = [
      "#3b82f6", // blue
      "#10b981", // green
      "#f59e0b", // yellow
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#6366f1", // indigo
      "#ef4444", // red
      "#f97316", // orange
    ]
    return colors[index % colors.length]
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-foreground">Spending by Category</h4>

      <div className="w-full h-80 flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={320}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pieData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(item.value)} ({item.percentage}%)
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export { CategoryBreakdown }
