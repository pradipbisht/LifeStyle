"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "./user-dashboard/DashboardLayout";
import WelcomeSection from "./components/WelcomeSection";
import StatsGrid from "./components/StatsGrid";
import RecentActivityCard from "./components/RecentActivityCard";
import QuickActionsCard from "./components/QuickActionsCard";
import RecommendationsCard from "./components/RecommendationsCard";
import {
  mockUser,
  mockStats,
  mockActivities,
  mockRecommendations,
} from "./components/mockData";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout user={mockUser}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        <WelcomeSection user={mockUser} stats={mockStats} />
        <StatsGrid stats={mockStats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentActivityCard activities={mockActivities} />
          <QuickActionsCard />
        </div>
        <RecommendationsCard recommendations={mockRecommendations} />
      </div>
    </DashboardLayout>
  );
}
