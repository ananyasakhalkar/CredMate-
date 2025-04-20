"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, PiggyBank, TrendingUp, CreditCard, LineChart } from "lucide-react"
import { getTranslation } from "@/lib/translations"

interface FinancialAdviceProps {
  language: string
  loanType?: string
  loanAmount?: number
}

export function FinancialAdvice({ language, loanType = "personal", loanAmount = 10000 }: FinancialAdviceProps) {
  const [activeTab, setActiveTab] = useState("savings")

  const adviceContent = {
    savings: {
      title: getTranslation("advice.savingsTips", language),
      icon: <PiggyBank className="h-5 w-5" />,
      items: [
        {
          title: "50/30/20 Rule",
          description: "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.",
        },
        {
          title: "Automatic Transfers",
          description: "Set up automatic transfers to your savings account on payday to ensure consistent saving.",
        },
        {
          title: "Emergency Fund",
          description:
            "Build an emergency fund that covers 3-6 months of expenses before focusing on other financial goals.",
        },
      ],
    },
    investments: {
      title: getTranslation("advice.investmentOptions", language),
      icon: <TrendingUp className="h-5 w-5" />,
      items: [
        {
          title: "Diversification",
          description: "Spread your investments across different asset classes to reduce risk.",
        },
        {
          title: "Retirement Accounts",
          description: "Maximize contributions to tax-advantaged retirement accounts like 401(k)s and IRAs.",
        },
        {
          title: "Dollar-Cost Averaging",
          description:
            "Invest a fixed amount regularly regardless of market conditions to reduce the impact of volatility.",
        },
      ],
    },
    debt: {
      title: getTranslation("advice.debtManagement", language),
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        {
          title: "Debt Snowball Method",
          description: "Pay off your smallest debts first to build momentum and motivation.",
        },
        {
          title: "Debt Avalanche Method",
          description: "Pay off high-interest debts first to minimize the total interest paid.",
        },
        {
          title: "Consolidation Options",
          description: "Consider consolidating high-interest debts into a lower-interest loan or balance transfer.",
        },
      ],
    },
    retirement: {
      title: getTranslation("advice.retirementPlanning", language),
      icon: <LineChart className="h-5 w-5" />,
      items: [
        {
          title: "Start Early",
          description:
            "The power of compound interest means that starting to save early can significantly increase your retirement funds.",
        },
        {
          title: "Employer Matching",
          description: "Take full advantage of employer matching contributions to retirement plans.",
        },
        {
          title: "Adjust Investments Over Time",
          description:
            "Gradually shift from growth-oriented to income-oriented investments as you approach retirement.",
        },
      ],
    },
  }

  // Loan-specific advice based on loan type and amount
  const getLoanAdvice = () => {
    if (loanType === "mortgage") {
      return {
        title: "Mortgage Management",
        description:
          "Consider making bi-weekly payments instead of monthly to reduce your mortgage term and save on interest.",
      }
    } else if (loanType === "auto") {
      return {
        title: "Auto Loan Tips",
        description:
          "Setting aside funds for maintenance can prevent future financial strain and extend the life of your vehicle.",
      }
    } else {
      return {
        title: "Personal Loan Management",
        description:
          "Try to pay more than the minimum payment each month to reduce the total interest paid over the life of the loan.",
      }
    }
  }

  const loanAdvice = getLoanAdvice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation("advice.title", language)}</CardTitle>
        <CardDescription>{getTranslation("advice.subtitle", language)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary">{loanAdvice.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{loanAdvice.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="debt">Debt</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
          </TabsList>

          {Object.entries(adviceContent).map(([key, content]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                {content.icon}
                <h3 className="font-medium">{content.title}</h3>
              </div>

              {content.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-2 gap-1">
                Learn more about {content.title.toLowerCase()}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

