"use client";

import { DashboardStats } from "./_components/dashboard-stats";
import { LoadingStats } from "./_components/loading-stats";
import { DonationChart } from "./_components/donation-chart";
import { RevenueChart } from "./_components/revenue-chart";
import { useDashboardData } from "@/hooks/use-dashboard-data";

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

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <>
        <style>{skeletonStyles}</style>
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
          <div>
            <div className="skeleton w-[150px] h-8 mb-2" />
            <div className="skeleton w-[200px] h-5" />
          </div>
          <LoadingStats />
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="skeleton w-full h-[400px]" />
            <div className="skeleton w-full h-[400px]" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Over View</h1>
          <p className="text-red-600">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Over View</h1>
        <p className="text-gray-600">Dashboard</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats data={dashboardData} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <DonationChart />
        <RevenueChart />
      </div>
    </div>
  );
}