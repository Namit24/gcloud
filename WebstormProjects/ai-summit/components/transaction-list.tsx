"use client"

import { motion } from "framer-motion"
import { formatAmount } from "@/lib/utils"
import { useMemo } from "react"

interface Transaction {
  date: string
  description: string
  amount: number
  category: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const limitedTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return []
    }
    return transactions.slice(0, 10)
  }, [transactions])

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-2xl mb-2 block">📄</span>
        <p className="text-xs text-muted-foreground">No transactions available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {limitedTransactions.map((transaction, index) => {
        const amount = formatAmount(transaction.amount)

        return (
          <motion.div
            key={`${transaction.date}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                <span className={`text-sm font-semibold ${amount.color}`}>{amount.value}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {transaction.category}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}

      {transactions.length > 10 && (
        <div className="text-center pt-4">
          <button className="text-xs text-primary hover:text-primary/80 font-medium">
            View all {transactions.length} transactions
          </button>
        </div>
      )}
    </div>
  )
}
