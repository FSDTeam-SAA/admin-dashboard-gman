import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface DashboardData {
  totalDonation: number
  totalRevenue: number
  totalSeller: number
  totalUser: number
  donationReport: Array<{
    month: number
    thisYear: number
    lastYear: number
  }>
  revenueReport: Array<{
    _id: {
      year: number
      month: number
      day: number
    }
    total: number
  }>
}

const fetchDashboardData = async (token: string): Promise<DashboardData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data")
  }

  const result = await response.json()
  return result.data
}

export function useDashboardData() {
  const { data: session } = useSession()
  const token = (session as { accessToken?: string })?.accessToken

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchDashboardData(token!),
    enabled: !!token,
  })
}
