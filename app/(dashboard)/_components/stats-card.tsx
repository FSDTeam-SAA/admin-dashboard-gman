import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  dotColor: string
  subtitle?: string
}

export function StatsCard({ title, value, icon: Icon, dotColor, subtitle = "132,570" }: StatsCardProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#272727]">{title}</CardTitle>
        <Image src={Icon} alt={title} width={20} height={20} className="w-8 h-8"/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center mt-2">
          <div className={`w-2 h-2 ${dotColor} rounded-full mr-2`}></div>
          <span className="text-xs text-[#545454]">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  )
}
