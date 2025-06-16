import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  dotColor: string
  subtitle?: string
}

export function StatsCard({ title, value, icon: Icon, iconColor, dotColor, subtitle = "132,570" }: StatsCardProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center mt-2">
          <div className={`w-2 h-2 ${dotColor} rounded-full mr-2`}></div>
          <span className="text-xs text-gray-500">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  )
}
