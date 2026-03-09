"use client"

import { useMemo, useState } from "react"
import { useAction, useQuery } from "@/lib/convex-mock"
import { api } from "@/convex/_generated/api"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DS2BarChart } from "@/components/ds2/chart-bar"
import { DS2DataTable } from "@/components/ds2/data-table"
import type { DS2Column } from "@/components/ds2/data-table"
import { DS2Spinner } from "@/components/ds2/spinner"
import { MobileBarChart, MobileDataCards } from "@/components/ds2/mobile"
import type { ChartConfig } from "@/components/ui/chart"
import { showError, showInfo } from "@/components/ds2/toast"
import { CREDIT_PACKS, PLAN_PRICE_BY_TIER } from "@/lib/polar"

const PLAN_OPTIONS = [
  { key: "starter", label: "Starter" },
  { key: "professional", label: "Professional" },
  { key: "enterprise", label: "Enterprise" },
] as const

type PlanTier = (typeof PLAN_OPTIONS)[number]["key"]
type CreditPackKey = (typeof CREDIT_PACKS)[number]["key"]

function formatTierLabel(tier: string) {
  if (tier === "professional") return "Professional"
  if (tier === "enterprise") return "Enterprise"
  if (tier === "starter") return "Starter"
  if (tier === "free") return "Free"
  return "No Plan"
}

function CreditBalanceCard({
  total,
  allocation,
  selectedPack,
  onPackChange,
  onBuyCredits,
  buying,
}: {
  total: number
  allocation: number
  selectedPack: CreditPackKey
  onPackChange: (value: CreditPackKey) => void
  onBuyCredits: () => void
  buying: boolean
}) {
  const creditsUsed = allocation - total
  const usagePercent = allocation > 0 ? (Math.max(0, creditsUsed) / allocation) * 100 : 0
  const remainingPercent = 100 - usagePercent

  let valueColor = "#f4b964"
  if (remainingPercent < 5) valueColor = "#e85454"
  else if (remainingPercent < 20) valueColor = "#e8956a"

  return (
    <Card>
      <CardContent>
        <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>
          Credits Remaining
        </p>

        <div className="flex items-center justify-between mb-5">
          <span className="sb-data" style={{ fontSize: 36, color: valueColor, lineHeight: 1 }}>
            {total}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 mb-4">
          <Select value={selectedPack} onValueChange={(v) => onPackChange(v as CreditPackKey)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CREDIT_PACKS.map((pack) => (
                <SelectItem key={pack.key} value={pack.key}>
                  {pack.credits} credits - ${pack.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="sb-btn-primary" onClick={onBuyCredits} disabled={buying}>
            {buying ? "Redirecting..." : "Buy Credits"}
          </Button>
        </div>

        <Progress value={usagePercent} className="mb-3" />
        <p className="sb-caption" style={{ color: "#6d8d9f" }}>
          <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
            {Math.max(0, Number(creditsUsed.toFixed(2)))}
          </span>{" "}
          of{" "}
          <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>
            {allocation}
          </span>{" "}
          credits used this month
        </p>
      </CardContent>
    </Card>
  )
}

function CurrentPlanCard({
  tier,
  maxBrands,
  allocation,
  maxSocialAccounts,
  renewalDate,
  selectedTier,
  onTierChange,
  onChangePlan,
  onManageBilling,
  changingPlan,
  openingPortal,
}: {
  tier: string
  maxBrands: number
  allocation: number
  maxSocialAccounts: number
  renewalDate?: number
  selectedTier: PlanTier
  onTierChange: (value: PlanTier) => void
  onChangePlan: () => void
  onManageBilling: () => void
  changingPlan: boolean
  openingPortal: boolean
}) {
  const price = PLAN_PRICE_BY_TIER[tier as keyof typeof PLAN_PRICE_BY_TIER] ?? 0

  return (
    <Card>
      <CardContent>
        <p className="sb-label" style={{ color: "#6d8d9f", marginBottom: 16 }}>
          Current Plan
        </p>

        <div className="flex items-baseline gap-3 mb-4">
          <h3 className="sb-h3" style={{ color: "#eaeef1" }}>
            {formatTierLabel(tier)}
          </h3>
          <span className="sb-data" style={{ color: "#f4b964", fontSize: 18 }}>
            ${price}/mo
          </span>
        </div>

        <p className="sb-caption mb-5" style={{ color: "#6d8d9f" }}>
          {renewalDate ? `Renews ${format(new Date(renewalDate), "MMMM d, yyyy")}` : "No renewal date"}
        </p>

        <ul className="space-y-2.5 mb-6">
          <li className="sb-body-sm" style={{ color: "#6d8d9f" }}>
            Up to <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>{maxBrands}</span> brands
          </li>
          <li className="sb-body-sm" style={{ color: "#6d8d9f" }}>
            <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>{allocation}</span> credits/month
          </li>
          <li className="sb-body-sm" style={{ color: "#6d8d9f" }}>
            <span className="sb-data" style={{ fontSize: 12, color: "#d4dce2" }}>{maxSocialAccounts}</span> social accounts
          </li>
        </ul>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Select value={selectedTier} onValueChange={(v) => onTierChange(v as PlanTier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((plan) => (
                  <SelectItem key={plan.key} value={plan.key}>
                    {plan.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="sb-btn-secondary" onClick={onChangePlan} disabled={changingPlan}>
              {changingPlan ? "Redirecting..." : "Change Plan"}
            </Button>
          </div>

          <Button className="sb-btn-ghost w-full" onClick={onManageBilling} disabled={openingPortal}>
            {openingPortal ? "Opening..." : "Manage Billing"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ConvexTransaction {
  _id: string
  type: string
  amount: number
  description: string
  createdAt: number
}

const chartConfig: ChartConfig = {
  credits: {
    label: "Credits",
    color: "#f4b964",
  },
}

const transactionColumns: DS2Column<ConvexTransaction>[] = [
  {
    key: "createdAt",
    label: "Date",
    isData: true,
    render: (val: number) => (
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
    key: "amount",
    label: "Credits",
    align: "right",
    isData: true,
    render: (val: number) => (
      <span className="sb-data" style={{ color: val < 0 ? "#e8956a" : "#a4f464" }}>
        {val > 0 ? "+" : ""}
        {val}
      </span>
    ),
  },
]

function UsageTabs({
  transactions,
  dailyUsage,
  maxBrands,
  maxSocialAccounts,
  socialUsed,
}: {
  transactions: ConvexTransaction[]
  dailyUsage: Array<{ date: string; credits: number }>
  maxBrands: number
  maxSocialAccounts: number
  socialUsed: number
}) {
  const brands = useQuery(api.brands.list)
  const brandsUsed = brands?.length ?? 0

  const chartData = useMemo(
    () =>
      dailyUsage.map((d) => ({
        date: format(new Date(`${d.date}T00:00:00Z`), "MMM d"),
        credits: d.credits,
      })),
    [dailyUsage]
  )

  const brandsProgress = maxBrands > 0 ? (brandsUsed / maxBrands) * 100 : 0
  const socialProgress = maxSocialAccounts > 0 ? (socialUsed / maxSocialAccounts) * 100 : 0

  return (
    <Tabs defaultValue="credits">
      <TabsList variant="line">
        <TabsTrigger value="credits">Credits</TabsTrigger>
        <TabsTrigger value="brands">Brands</TabsTrigger>
        <TabsTrigger value="social">Social Accounts</TabsTrigger>
      </TabsList>

      <TabsContent value="credits" className="space-y-6 pt-6">
        {/* Mobile chart */}
        <MobileBarChart
          data={chartData}
          dataKey="credits"
          nameKey="date"
          config={chartConfig}
        />
        {/* Desktop chart */}
        <div className="hidden lg:block">
          <DS2BarChart
            data={chartData}
            dataKey="credits"
            nameKey="date"
            height={240}
            config={chartConfig}
          />
        </div>
        {/* Mobile transactions */}
        <div className="lg:hidden">
          <MobileDataCards
            cards={transactions.map((t) => ({
              title: <span className="sb-body-sm" style={{ color: "#d4dce2" }}>{t.description}</span>,
              subtitle: <span className="sb-caption" style={{ color: "#6d8d9f" }}>{format(new Date(t.createdAt), "MMM d, yyyy")}</span>,
              fields: [
                {
                  label: "Credits",
                  value: <span className="sb-data" style={{ color: t.amount < 0 ? "#e8956a" : "#a4f464" }}>{t.amount > 0 ? "+" : ""}{t.amount}</span>,
                },
              ],
            }))}
          />
        </div>
        {/* Desktop table */}
        <div className="hidden lg:block">
          <DS2DataTable columns={transactionColumns} data={transactions} />
        </div>
      </TabsContent>

      <TabsContent value="brands" className="pt-6">
        <Card>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="sb-data-lg" style={{ color: "#f4b964" }}>{brandsUsed}</span>
              <span className="sb-body" style={{ color: "#6d8d9f" }}>
                of <span className="sb-data" style={{ color: "#d4dce2" }}>{maxBrands}</span> brands used
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
              <span className="sb-data-lg" style={{ color: "#f4b964" }}>{socialUsed}</span>
              <span className="sb-body" style={{ color: "#6d8d9f" }}>
                of <span className="sb-data" style={{ color: "#d4dce2" }}>{maxSocialAccounts}</span> social accounts connected
              </span>
            </div>
            <Progress value={socialProgress} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default function BillingPage() {
  const user = useQuery(api.users.current)
  const balance = useQuery(api.credits.getBalance)
  const transactionsResult = useQuery(api.credits.getTransactions, { limit: 40 })
  const dailyUsage = useQuery(api.credits.getDailyUsage, { days: 30 })
  const connectedAccounts = useQuery(api.socialAccounts.listConnectedForCurrentUser)

  const generateTopUpCheckoutLink = useAction(api.polar.generateTopUpCheckoutLink)
  const generatePlanCheckoutLink = useAction(api.polar.generatePlanCheckoutLink)
  const generateCustomerPortalUrl = useAction(api.polar.generateCustomerPortalUrl)

  const [selectedPack, setSelectedPack] = useState<CreditPackKey>("credits_100")
  const [selectedTier, setSelectedTier] = useState<PlanTier>("professional")
  const [buyingCredits, setBuyingCredits] = useState(false)
  const [changingPlan, setChangingPlan] = useState(false)
  const [openingPortal, setOpeningPortal] = useState(false)

  const transactions: ConvexTransaction[] = useMemo(() => {
    if (!transactionsResult?.transactions) return []
    return transactionsResult.transactions as unknown as ConvexTransaction[]
  }, [transactionsResult])

  if (
    user === undefined ||
    balance === undefined ||
    transactionsResult === undefined ||
    dailyUsage === undefined ||
    connectedAccounts === undefined
  ) {
    return (
      <div className="flex items-center justify-center py-32">
        <DS2Spinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="sb-body" style={{ color: "#6d8d9f" }}>
          Please sign in to view billing.
        </p>
      </div>
    )
  }

  const startTopUpCheckout = async () => {
    try {
      setBuyingCredits(true)
      const result = await generateTopUpCheckoutLink({
        packKey: selectedPack,
        origin: window.location.origin,
        successUrl: `${window.location.origin}/dashboard/billing`,
      })
      window.location.href = result.url
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to start checkout"
      showError("Buy credits failed", message)
      setBuyingCredits(false)
    }
  }

  const startPlanCheckout = async () => {
    if (selectedTier === user.subscriptionTier) {
      showInfo("Already on this plan", "Choose a different plan to switch")
      return
    }

    try {
      setChangingPlan(true)
      const result = await generatePlanCheckoutLink({
        tier: selectedTier,
        origin: window.location.origin,
        successUrl: `${window.location.origin}/dashboard/billing`,
      })
      window.location.href = result.url
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to start checkout"
      showError("Plan change failed", message)
      setChangingPlan(false)
    }
  }

  const openBillingPortal = async () => {
    try {
      setOpeningPortal(true)
      const result = await generateCustomerPortalUrl({})
      window.location.href = result.url
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to open billing portal"
      showError("Billing portal failed", message)
      setOpeningPortal(false)
    }
  }

  return (
    <div className="px-4 lg:px-0 space-y-8 lg:space-y-32 py-4 lg:py-0">
      <div>
        <h1 className="sb-h1 text-[24px] lg:text-[44px]" style={{ color: "#eaeef1" }}>Billing & Credits</h1>
        <p className="sb-body mt-2 lg:mt-3" style={{ color: "#6d8d9f" }}>
          <span className="hidden lg:inline">Manage your subscription, buy credit packs, and monitor account usage.</span>
          <span className="lg:hidden">Manage billing and credits.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreditBalanceCard
          total={balance.total}
          allocation={balance.allocation}
          selectedPack={selectedPack}
          onPackChange={setSelectedPack}
          onBuyCredits={startTopUpCheckout}
          buying={buyingCredits}
        />
        <CurrentPlanCard
          tier={user.subscriptionTier}
          maxBrands={user.maxBrands}
          allocation={balance.allocation}
          maxSocialAccounts={user.maxSocialAccounts}
          renewalDate={balance.renewalDate}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          onChangePlan={startPlanCheckout}
          onManageBilling={openBillingPortal}
          changingPlan={changingPlan}
          openingPortal={openingPortal}
        />
      </div>

      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Usage</p>
        <h3 className="sb-h3 mb-4 lg:mb-6 text-lg lg:text-[22px]" style={{ color: "#eaeef1" }}>Usage Breakdown</h3>
        <UsageTabs
          transactions={transactions}
          dailyUsage={dailyUsage}
          maxBrands={user.maxBrands}
          maxSocialAccounts={user.maxSocialAccounts}
          socialUsed={connectedAccounts.length}
        />
      </div>

      <Separator />

      <div>
        <p className="sb-label mb-2" style={{ color: "#e8956a" }}>Invoices</p>
        <h3 className="sb-h3 mb-3" style={{ color: "#eaeef1" }}>Billing History</h3>
        <Card>
          <CardContent>
            <p className="sb-body-sm" style={{ color: "#6d8d9f", marginBottom: 12 }}>
              Invoices are available in your Polar customer portal.
            </p>
            <div className="flex items-center gap-2">
              <Label className="sb-caption" style={{ color: "#6d8d9f" }}>Need an invoice PDF?</Label>
              <Button className="sb-btn-secondary" onClick={openBillingPortal} disabled={openingPortal}>
                {openingPortal ? "Opening..." : "Open Billing Portal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
