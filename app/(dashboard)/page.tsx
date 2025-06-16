"use client"

import { useState } from "react"
import { DashboardStats } from "./_components/dashboard-stats"
import { LoadingStats } from "./_components/loading-stats"
import { DonationChart } from "./_components/donation-chart"
import { RevenueChart } from "./_components/revenue-chart"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export default function Dashboard() {
  const [donationTimePeriod, setDonationTimePeriod] = useState<"Day" | "Week" | "Month" | "Year">("Month")
  const [revenueTimePeriod, setRevenueTimePeriod] = useState<"Day" | "Week" | "Month" | "Year">("Month")

  const { data: dashboardData, isLoading, error } = useDashboardData()

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Over View</h1>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
        <LoadingStats />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Over View</h1>
          <p className="text-red-600">Error loading dashboard data</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Over View</h1>
        <p className="text-gray-600">Dashboard</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats data={dashboardData} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <DonationChart
          data={dashboardData.donationReport}
          timePeriod={donationTimePeriod}
          onTimePeriodChange={setDonationTimePeriod}
        />
        <RevenueChart
          data={dashboardData.revenueReport}
          timePeriod={revenueTimePeriod}
          onTimePeriodChange={setRevenueTimePeriod}
        />
      </div>
    </div>
  )
}
