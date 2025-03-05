"use client"

import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface BudgetInsightsProps {
  insights: {
    budget: string
    preApproved: boolean
    preApprovalAmount?: string
    affordabilityScore: number
    monthlyPayment: string
    downPayment: string
    recommendations: string[]
  }
}

export default function BudgetInsights({ insights }: BudgetInsightsProps) {
  return (
    <div className="space-y-6 animate-in">
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Budget Overview</h3>
          <div className="flex items-center">
            <DollarSign size={18} className="mr-1 text-primary" />
            <span className="text-xl font-bold">{insights.budget}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pre-approved</span>
            <div className="flex items-center">
              {insights.preApproved ? (
                <span className="text-green-500 flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  Yes, {insights.preApprovalAmount}
                </span>
              ) : (
                <span className="text-destructive flex items-center">
                  <TrendingDown size={16} className="mr-1" />
                  No
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Affordability Score</span>
            <div className="flex items-center">
              <div className="w-32 h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${insights.affordabilityScore}%` }}></div>
              </div>
              <span className="ml-2">{insights.affordabilityScore}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Monthly Payment</span>
            <span>{insights.monthlyPayment}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Down Payment</span>
            <span>{insights.downPayment}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
        <div className="space-y-2">
          {insights.recommendations.map((recommendation, index) => (
            <div key={index} className="glass-card p-3 flex">
              <AlertCircle size={18} className="mr-2 text-primary shrink-0" />
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

