
import { StatsCard } from "./stats-card"

interface DashboardData {
  totalDonation: number
  totalRevenue: number
  totalSeller: number
  totalUser: number
}

interface DashboardStatsProps {
  data: DashboardData
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const statsConfig = [
    {
      title: "Total Donation",
      value: `$${data.totalDonation.toLocaleString()}`,
      icon: "/assets/totalDonation.png",
      dotColor: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: "/assets/totalRevenue.png",
      dotColor: "bg-blue-500",
    },
    {
      title: "Total Seller",
      value: data.totalSeller.toLocaleString(),
      icon: "/assets/totalSeller.png",
      dotColor: "bg-orange-500",
    },
    {
      title: "Total User",
      value: data.totalUser.toLocaleString(),
      icon: "/assets/totalUser.png",
      dotColor: "bg-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          dotColor={stat.dotColor}
        />
      ))}
    </div>
  )
}
