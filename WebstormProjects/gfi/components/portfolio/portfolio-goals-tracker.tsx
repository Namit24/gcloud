"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, Calendar, TrendingUp, Home, Car, GraduationCap, Plane } from "lucide-react"
import type { CombinedPortfolio } from "@/utils/portfolio-merger"

interface FinancialGoal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: "retirement" | "house" | "car" | "education" | "vacation" | "emergency" | "other"
  priority: "high" | "medium" | "low"
  monthlyContribution: number
}

interface PortfolioGoalsTrackerProps {
  combinedPortfolio: CombinedPortfolio
}

export function PortfolioGoalsTracker({ combinedPortfolio }: PortfolioGoalsTrackerProps) {
  const [goals, setGoals] = useState<FinancialGoal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      description: "6 months of expenses",
      targetAmount: 300000,
      currentAmount: 125000,
      targetDate: "2024-12-31",
      category: "emergency",
      priority: "high",
      monthlyContribution: 10000,
    },
    {
      id: "2",
      title: "House Down Payment",
      description: "20% down payment for ₹50L house",
      targetAmount: 1000000,
      currentAmount: 350000,
      targetDate: "2026-06-30",
      category: "house",
      priority: "high",
      monthlyContribution: 25000,
    },
    {
      id: "3",
      title: "Retirement Corpus",
      description: "Comfortable retirement by 60",
      targetAmount: 20000000,
      currentAmount: combinedPortfolio.totalNetWorth,
      targetDate: "2050-01-01",
      category: "retirement",
      priority: "medium",
      monthlyContribution: 15000,
    },
  ])

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    category: "other",
    priority: "medium",
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "retirement":
        return <Target className="h-4 w-4" />
      case "house":
        return <Home className="h-4 w-4" />
      case "car":
        return <Car className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      case "vacation":
        return <Plane className="h-4 w-4" />
      case "emergency":
        return <Target className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      retirement: "purple",
      house: "blue",
      car: "green",
      education: "orange",
      vacation: "pink",
      emergency: "red",
      other: "gray",
    }
    return colors[category] || "gray"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const calculateMonthsToGoal = (current: number, target: number, monthlyContribution: number) => {
    if (monthlyContribution <= 0) return Number.POSITIVE_INFINITY
    return Math.ceil((target - current) / monthlyContribution)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) return

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || "",
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount || 0,
      targetDate: newGoal.targetDate,
      category: newGoal.category as any,
      priority: newGoal.priority as any,
      monthlyContribution: newGoal.monthlyContribution || 0,
    }

    setGoals((prev) => [...prev, goal])
    setNewGoal({ category: "other", priority: "medium" })
    setIsAddingGoal(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Financial Goals Tracker</span>
            </CardTitle>
            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Financial Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., New Car, Vacation, etc."
                      value={newGoal.title || ""}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of your goal"
                      value={newGoal.description || ""}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="500000"
                        value={newGoal.targetAmount || ""}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, targetAmount: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        placeholder="50000"
                        value={newGoal.currentAmount || ""}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, currentAmount: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={newGoal.targetDate || ""}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
                      <Input
                        id="monthlyContribution"
                        type="number"
                        placeholder="5000"
                        value={newGoal.monthlyContribution || ""}
                        onChange={(e) =>
                          setNewGoal((prev) => ({ ...prev, monthlyContribution: Number(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newGoal.category}
                        onValueChange={(value) => setNewGoal((prev) => ({ ...prev, category: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="emergency">Emergency Fund</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newGoal.priority}
                        onValueChange={(value) => setNewGoal((prev) => ({ ...prev, priority: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addGoal} className="w-full">
                    Add Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
              const monthsToGoal = calculateMonthsToGoal(
                goal.currentAmount,
                goal.targetAmount,
                goal.monthlyContribution,
              )
              const yearsToGoal = Math.floor(monthsToGoal / 12)
              const remainingMonths = monthsToGoal % 12

              return (
                <Card
                  key={goal.id}
                  className="border-l-4"
                  style={{ borderLeftColor: `var(--${getCategoryColor(goal.category)}-500)` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${getCategoryColor(goal.category)}-50`}>
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{goal.title}</h4>
                          {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {goal.category.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          Progress: {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="text-muted-foreground">Remaining</p>
                          <p className="font-semibold">{formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="text-muted-foreground">Monthly SIP</p>
                          <p className="font-semibold">{formatCurrency(goal.monthlyContribution)}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="text-muted-foreground">Time to Goal</p>
                          <p className="font-semibold">
                            {monthsToGoal === Number.POSITIVE_INFINITY
                              ? "∞"
                              : yearsToGoal > 0
                                ? `${yearsToGoal}y ${remainingMonths}m`
                                : `${remainingMonths}m`}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Optimize
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
