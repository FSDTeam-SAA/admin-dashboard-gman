import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TimePeriodSelector } from "./time-period-selector";
import { ChartLegend } from "./chart-legend";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type TimePeriod = "Week" | "Month" | "Year";

// Custom CSS for the skeleton loader
const skeletonStyles = `
  .skeleton {
    background: #e5e7eb; /* Tailwind's gray-200 */
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }
  .skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

export function DonationChart() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Month");
  const session = useSession();
  const token = (session?.data as { accessToken?: string })?.accessToken;

  const fetchDonationData = async (timePeriod: string) => {
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard?range=${timePeriod.toLowerCase()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch donation data");
    }

    const responseData = await response.json();
    const donationData = responseData.data.donationReport;

    return donationData.map((item: { label: string; total: number }) => ({
      month: item.label,
      "This Year": item.total,
      "Last Year": 0,
    }));
  };

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
    <>
      <style>{skeletonStyles}</style>
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            {isLoading ? (
              <div className="skeleton w-[150px] h-5" />
            ) : (
              <CardTitle className="text-lg font-semibold text-gray-900">Donation Report</CardTitle>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <>
                <div className="skeleton w-[100px] h-5" />
                <div className="skeleton w-[120px] h-8" />
              </>
            ) : (
              <>
                <ChartLegend items={legendItems} />
                <TimePeriodSelector selectedPeriod={timePeriod} onPeriodChange={handleTimePeriodChange} />
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="skeleton w-full h-[300px]" />
          ) : error ? (
            <div className="text-center text-red-500">{(error as Error).message}</div>
          ) : (
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
    </>
  );
}