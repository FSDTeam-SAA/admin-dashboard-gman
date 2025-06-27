import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TimePeriodSelector } from "./time-period-selector";
import { ChartLegend } from "./chart-legend";
import { useQuery } from "@tanstack/react-query";



const fetchDonationData = async (timePeriod: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard?range=${timePeriod.toLowerCase()}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch donation data");
  }
  const responseData = await response.json();
  
  // Extract donationReport from the response data
  const donationData = responseData.data.donationReport;

  // Transform the data to match the chart's expected format
  return donationData.map((item: { label: string; total: number }) => ({
    month: item.label,
    "This Year": item.total,
    "Last Year": 0, // Set to 0 since last year's data is not provided
  }));
};

type TimePeriod = "Day" | "Week" | "Month" | "Year";

export function DonationChart() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Month");

  const { data, isLoading, error } = useQuery({
    queryKey: ["donationData", timePeriod],
    queryFn: () => fetchDonationData(timePeriod),
  });

  const legendItems = [
    { color: "bg-purple-500", label: "This Year" },
    { color: "bg-pink-500", label: "Last Year" },
  ];

  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Donation Report</CardTitle>
        </div>
        <div className="flex items-center space-x-4">
          <ChartLegend items={legendItems} />
          <TimePeriodSelector selectedPeriod={timePeriod} onPeriodChange={handleTimePeriodChange} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{(error as Error).message}</div>}
        {!isLoading && !error && data && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
        )}
      </CardContent>
    </Card>
  );
}