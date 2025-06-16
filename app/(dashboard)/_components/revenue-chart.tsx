import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartLegend } from "./chart-legend"
import { TimePeriodSelector } from "./time-period-selector"

interface RevenueData {
  _id: {
    year: number
    month: number
    day: number
  }
  total: number
}

interface RevenueChartProps {
  data: RevenueData[]
  timePeriod: "Day" | "Week" | "Month" | "Year"
  onTimePeriodChange: (period: "Day" | "Week" | "Month" | "Year") => void
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function RevenueChart({ data, timePeriod, onTimePeriodChange }: RevenueChartProps) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item._id.year, item._id.month - 1, item._id.day)
    if (timePeriod === "Year") return item._id.year === currentYear
    if (timePeriod === "Month") return item._id.year === currentYear && item._id.month === currentMonth
    if (timePeriod === "Week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return itemDate >= oneWeekAgo && itemDate <= now
    }
    if (timePeriod === "Day")
      return item._id.year === currentYear && item._id.month === currentMonth && item._id.day === currentDay
    return true
  })

  const chartData = filteredData.map((item, index) => ({
    date:
      timePeriod === "Year"
        ? monthNames[item._id.month - 1]
        : timePeriod === "Month"
          ? `${item._id.day}/${item._id.month}`
          : timePeriod === "Week"
            ? `${item._id.day}/${item._id.month}`
            : `${item._id.day}/${item._id.month}`,
    "This Period": item.total,
    "Last Period": index > 0 ? filteredData[index - 1].total : item.total,
  }))

  const legendItems = [
    { color: "bg-green-500", label: `This ${timePeriod}` },
    { color: "bg-blue-500", label: `Last ${timePeriod}` },
  ]

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue Report</CardTitle>
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
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="This Period"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Last Period"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
