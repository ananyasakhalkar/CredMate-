"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LoanCalculatorProps {
  language: string
  defaultAmount?: number
  defaultTerm?: number
  defaultRate?: number
  defaultType?: string
}

export function LoanCalculator({
  language,
  defaultAmount = 10000,
  defaultTerm = 36,
  defaultRate = 5.9,
  defaultType = "personal",
}: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(defaultAmount)
  const [loanTerm, setLoanTerm] = useState(defaultTerm)
  const [interestRate, setInterestRate] = useState(defaultRate)
  const [loanType, setLoanType] = useState(defaultType)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)

  // Calculate loan details when inputs change
  useEffect(() => {
    calculateLoan()
  }, [loanAmount, loanTerm, interestRate])

  const calculateLoan = () => {
    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12

    // Calculate monthly payment using the formula: P = L[i(1+i)^n]/[(1+i)^n-1]
    // Where P = monthly payment, L = loan amount, i = monthly interest rate, n = number of payments
    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) / (Math.pow(1 + monthlyRate, loanTerm) - 1)

    // Calculate total payment and interest
    const totalPayment = monthlyPayment * loanTerm
    const totalInterest = totalPayment - loanAmount

    setMonthlyPayment(isNaN(monthlyPayment) ? 0 : monthlyPayment)
    setTotalInterest(isNaN(totalInterest) ? 0 : totalInterest)
    setTotalPayment(isNaN(totalPayment) ? 0 : totalPayment)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setLoanAmount(value)
    }
  }

  const handleSliderAmountChange = (value: number[]) => {
    setLoanAmount(value[0])
  }

  const handleTermChange = (value: string) => {
    setLoanTerm(Number.parseInt(value))
  }

  const handleTypeChange = (value: string) => {
    setLoanType(value)

    // Adjust interest rate based on loan type
    switch (value) {
      case "mortgage":
        setInterestRate(3.5)
        break
      case "auto":
        setInterestRate(4.5)
        break
      case "personal":
      default:
        setInterestRate(5.9)
        break
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="loan-type">Loan Type</Label>
          <Select value={loanType} onValueChange={handleTypeChange}>
            <SelectTrigger id="loan-type">
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Loan</SelectItem>
              <SelectItem value="auto">Auto Loan</SelectItem>
              <SelectItem value="mortgage">Mortgage</SelectItem>
              <SelectItem value="business">Business Loan</SelectItem>
              <SelectItem value="student">Student Loan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(loanAmount)}</span>
          </div>
          <Input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={handleAmountChange}
            min={1000}
            max={1000000}
            step={1000}
          />
          <Slider
            value={[loanAmount]}
            min={1000}
            max={100000}
            step={1000}
            onValueChange={handleSliderAmountChange}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$1,000</span>
            <span>$100,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="loan-term">Loan Term (months)</Label>
            <span className="text-sm text-muted-foreground">{loanTerm} months</span>
          </div>
          <Select value={loanTerm.toString()} onValueChange={handleTermChange}>
            <SelectTrigger id="loan-term">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 months (1 year)</SelectItem>
              <SelectItem value="24">24 months (2 years)</SelectItem>
              <SelectItem value="36">36 months (3 years)</SelectItem>
              <SelectItem value="48">48 months (4 years)</SelectItem>
              <SelectItem value="60">60 months (5 years)</SelectItem>
              <SelectItem value="120">120 months (10 years)</SelectItem>
              <SelectItem value="180">180 months (15 years)</SelectItem>
              <SelectItem value="240">240 months (20 years)</SelectItem>
              <SelectItem value="360">360 months (30 years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <span className="text-sm text-muted-foreground">{interestRate}%</span>
          </div>
          <Input
            id="interest-rate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number.parseFloat(e.target.value))}
            min={0.1}
            max={30}
            step={0.1}
          />
        </div>

        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Monthly Payment:</span>
            <span className="font-semibold text-lg text-primary">{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Interest:</span>
            <span className="font-medium">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Payment:</span>
            <span className="font-medium">{formatCurrency(totalPayment)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

