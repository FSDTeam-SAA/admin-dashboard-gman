import { Users, UserCheck, DollarSign, Heart } from "lucide-react"
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
      icon: Heart,
      iconColor: "text-green-500",
      dotColor: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-blue-500",
      dotColor: "bg-blue-500",
    },
    {
      title: "Total Seller",
      value: data.totalSeller.toLocaleString(),
      icon: Users,
      iconColor: "text-orange-500",
      dotColor: "bg-orange-500",
    },
    {
      title: "Total User",
      value: data.totalUser.toLocaleString(),
      icon: UserCheck,
      iconColor: "text-green-600",
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
          iconColor={stat.iconColor}
          dotColor={stat.dotColor}
        />
      ))}
    </div>
  )
}
