"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download04Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { DS2BarChart } from "@/components/ds2/chart-bar"
import { DS2DataTable } from "@/components/ds2/data-table"
import type { DS2Column } from "@/components/ds2/data-table"
import { StatusBadge } from "@/components/ds2/status-badge"
import type { ChartConfig } from "@/components/ui/chart"
import {
  MOCK_CREDITS,
  MOCK_SUBSCRIPTION,
  MOCK_CREDIT_TRANSACTIONS,
  MOCK_BILLING_HISTORY,
  MOCK_DAILY_CREDIT_USAGE,
} from "@/lib/mock-data"
import type { CreditTransaction, BillingInvoice } from "@/types/dashboard"
import { format } from "date-fns"

// ── Credit Balance Card ──────────────────────────────────────────────────

function CreditBalanceCard() {
  const [progressValue, setProgressValue] = useState(0)
  const creditsUsed = MOCK_SUBSCRIPTION.creditsPerMonth - MOCK_CREDITS
  const usagePercent = (creditsUsed / MOCK_SUBSCRIPTION.creditsPerMonth) * 100
  const remainingPercent = 100 - usagePercent

  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(usagePercent), 100)
    return () => clearTimeout(timer)
  }, [usagePercent])

  // Color logic: gold default, coral if <20%, red if <5%
  let valueColor = "#f4b964"
  if (remainingPercent < 5) {
    valueColor = "#e85454"
  } else if (remainingPercent < 20) {
    valueColor = "#e8956a"
  }

  return (
    <Card>
      <CardContent>
        <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>
          Credits Remaining
        </p>
        <div className="flex items-center justify-between mb-6">
          <span
            className="sb-data"
            style={{
              fontSize: 36,
              color: valueColor,
              lineHeight: 1,
            }}
          >
            {MOCK_CREDITS}
          </span>
          <Button className="sb-btn-primary">
            Buy Credits
          </Button>
        </div>
        <Progress value={progressValue} className="mb-3" />
        <p className="sb-caption" style={{ color: "#6d8d9f" }}>
          <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
            {creditsUsed}
          </span>
          {" "}of{" "}
          <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
            {MOCK_SUBSCRIPTION.creditsPerMonth}
          </span>
          {" "}credits used this month
        </p>
      </CardContent>
    </Card>
  )
}

// ── Current Plan Card ────────────────────────────────────────────────────

function CurrentPlanCard() {
  const renewalDate = new Date(MOCK_SUBSCRIPTION.renewalDate)

  return (
    <Card>
      <CardContent>
        <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>
          Current Plan
        </p>
        <div className="flex items-baseline gap-3 mb-4">
          <h3 className="sb-h3" style={{ color: "#eaeef1" }}>
            {MOCK_SUBSCRIPTION.plan}
          </h3>
          <span
            className="sb-data"
            style={{ color: "#f4b964", fontSize: 18 }}
          >
            ${MOCK_SUBSCRIPTION.pricePerMonth}/mo
          </span>
        </div>
        <p className="sb-caption mb-5" style={{ color: "#6d8d9f" }}>
          Renews {format(renewalDate, "MMMM d, yyyy")}
        </p>
        <ul className="space-y-2.5 mb-6">
          <li className="flex items-center gap-2">
            <span
              style={{
                width: 4,
                height: 4,
                background: "rgba(244,185,100,0.40)",
                flexShrink: 0,
              }}
            />
            <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              Up to{" "}
              <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
                {MOCK_SUBSCRIPTION.maxBrands}
              </span>
              {" "}brands
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              style={{
                width: 4,
                height: 4,
                background: "rgba(244,185,100,0.40)",
                flexShrink: 0,
              }}
            />
            <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
                {MOCK_SUBSCRIPTION.creditsPerMonth}
              </span>
              {" "}credits/month
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              style={{
                width: 4,
                height: 4,
                background: "rgba(244,185,100,0.40)",
                flexShrink: 0,
              }}
            />
            <span className="sb-body-sm" style={{ color: "#6d8d9f" }}>
              <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
                {MOCK_SUBSCRIPTION.maxSocialAccounts}
              </span>
              {" "}social accounts
            </span>
          </li>
        </ul>
        <Button className="sb-btn-secondary">
          Change Plan
        </Button>
      </CardContent>
    </Card>
  )
}

// ── Usage Tabs ───────────────────────────────────────────────────────────

const chartConfig: ChartConfig = {
  credits: {
    label: "Credits",
    color: "#f4b964",
  },
}

const chartData = MOCK_DAILY_CREDIT_USAGE.map((d) => ({
  date: format(new Date(d.date), "MMM d"),
  credits: d.credits,
}))

const transactionColumns: DS2Column<CreditTransaction>[] = [
  {
    key: "date",
    label: "Date",
    isData: true,
    render: (val: string) => (
      <span className="sb-data" style={{ color: "#d4dce2", fontSize: 12, fontWeight: 500 }}>
        {format(new Date(val), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (val: string) => (
      <span className="sb-body-sm" style={{ color: "#d4dce2" }}>
        {val}
      </span>
    ),
  },
  {
    key: "creditsUsed",
    label: "Credits",
    align: "right",
    isData: true,
    render: (val: number) => (
      <span className="sb-data" style={{ color: "#eaeef1" }}>
        {val}
      </span>
    ),
  },
]

function UsageTabs() {
  const brandsUsed = 3
  const brandsMax = MOCK_SUBSCRIPTION.maxBrands
  const socialUsed = 7
  const socialMax = MOCK_SUBSCRIPTION.maxSocialAccounts

  const [brandsProgress, setBrandsProgress] = useState(0)
  const [socialProgress, setSocialProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBrandsProgress((brandsUsed / brandsMax) * 100)
      setSocialProgress((socialUsed / socialMax) * 100)
    }, 100)
    return () => clearTimeout(timer)
  }, [brandsMax, socialMax])

  return (
    <Tabs defaultValue="credits">
      <TabsList variant="line">
        <TabsTrigger value="credits">Credits</TabsTrigger>
        <TabsTrigger value="brands">Brands</TabsTrigger>
        <TabsTrigger value="social">Social Accounts</TabsTrigger>
      </TabsList>

      <TabsContent value="credits" className="space-y-6 pt-6">
        <DS2BarChart
          data={chartData}
          dataKey="credits"
          nameKey="date"
          height={240}
          config={chartConfig}
        />
        <DS2DataTable
          columns={transactionColumns}
          data={MOCK_CREDIT_TRANSACTIONS}
        />
      </TabsContent>

      <TabsContent value="brands" className="pt-6">
        <Card>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="sb-data-lg" style={{ color: "#f4b964" }}>
                {brandsUsed}
              </span>
              <span className="sb-body" style={{ color: "#6d8d9f" }}>
                of{" "}
                <span className="sb-data" style={{ color: "#d4dce2" }}>
                  {brandsMax}
                </span>
                {" "}brands used
              </span>
            </div>
            <Progress value={brandsProgress} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social" className="pt-6">
        <Card>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="sb-data-lg" style={{ color: "#f4b964" }}>
                {socialUsed}
              </span>
              <span className="sb-body" style={{ color: "#6d8d9f" }}>
                of{" "}
                <span className="sb-data" style={{ color: "#d4dce2" }}>
                  {socialMax}
                </span>
                {" "}social accounts connected
              </span>
            </div>
            <Progress value={socialProgress} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// ── Billing History Table ────────────────────────────────────────────────

const invoiceColumns: DS2Column<BillingInvoice>[] = [
  {
    key: "date",
    label: "Date",
    isData: true,
    render: (val: string) => (
      <span className="sb-data" style={{ color: "#d4dce2", fontSize: 12, fontWeight: 500 }}>
        {format(new Date(val), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    isData: true,
    render: (val: number) => (
      <span className="sb-data" style={{ color: "#eaeef1" }}>
        ${val.toFixed(2)}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val: string) => <StatusBadge status={val} />,
  },
  {
    key: "id",
    label: "",
    align: "right",
    render: () => (
      <Button
        className="sb-btn-ghost-inline"
        size="sm"
        aria-label="Download invoice"
      >
        <HugeiconsIcon icon={Download04Icon} size={16} />
      </Button>
    ),
  },
]

// ── Page ─────────────────────────────────────────────────────────────────

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="sb-h1" style={{ color: "#eaeef1" }}>
          Billing & Credits
        </h1>
        <p className="sb-body mt-3" style={{ color: "#6d8d9f" }}>
          Manage your subscription, track credit usage, and view invoices.
        </p>
      </div>

      {/* Top Row: Credit Balance + Current Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreditBalanceCard />
        <CurrentPlanCard />
      </div>

      {/* Usage Breakdown */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Usage</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Usage Breakdown</h3>
        <UsageTabs />
      </div>

      <Separator />

      {/* Billing History */}
      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Invoices</p>
        <h3 className="sb-h3 mb-6" style={{ color: "#eaeef1" }}>Billing History</h3>
        <DS2DataTable columns={invoiceColumns} data={MOCK_BILLING_HISTORY} />
      </div>
    </div>
  )
}
