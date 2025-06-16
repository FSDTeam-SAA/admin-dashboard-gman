import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TimePeriodSelector } from "./time-period-selector"
import { ChartLegend } from "./chart-legend"

interface DonationData {
  month: number
  thisYear: number
  lastYear: number
}

interface DonationChartProps {
  data: DonationData[]
  timePeriod: "Day" | "Week" | "Month" | "Year"
  onTimePeriodChange: (period: "Day" | "Week" | "Month" | "Year") => void
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function DonationChart({ data, timePeriod, onTimePeriodChange }: DonationChartProps) {
  const chartData = data.map((item) => ({
    month: monthNames[item.month - 1],
    "This Year": item.thisYear,
    "Last Year": item.lastYear,
  }))

  const legendItems = [
    { color: "bg-purple-500", label: "This Year" },
    { color: "bg-pink-500", label: "Last Year" },
  ]

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Donation report</CardTitle>
        </div>
        <div className="flex items-center space-x-4">
          <ChartLegend items={legendItems} />
          <TimePeriodSelector selectedPeriod={timePeriod} onPeriodChange={onTimePeriodChange} />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="This Year"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Last Year"
              stroke="#ec4899"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
