import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`
}

export function formatAmount(amount: number) {
  const isPositive = amount > 0
  return {
    value: `${isPositive ? "+" : ""}₹${Math.abs(amount).toLocaleString("en-IN")}`,
    color: isPositive ? "text-green-500" : "text-red-500",
  }
}
