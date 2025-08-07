import { StatsCard } from "./stats-card";
import { useEffect, useState } from "react";

interface DashboardData {
  totalDonation: number;
  totalRevenue: number;
  totalSeller: number;
  totalUser: number;
}

interface DashboardStatsProps {
  data: DashboardData;
}

interface VisitorData {
  _id: string;
  lastVisit: string;
  paths: string[];
  totalHits: number;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const [totalVisitors, setTotalVisitors] = useState<number>(0);

  // Fetch visitor data from the API
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ip/track`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Sum totalHits from all records
          const total = result.data.reduce(
            (sum: number, item: VisitorData) => sum + item.totalHits,
            0
          );
          setTotalVisitors(total);
        }
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };

    fetchVisitorData();
  }, []);

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
    {
      title: "Total Visitors",
      value: totalVisitors.toLocaleString(),
      icon: "/assets/totalUser.png",
      dotColor: "bg-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
  );
}
