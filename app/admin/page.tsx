"use client";

import AdminLayout from "./AdminLayout";
import {
  Users,
  FileText,
  MessageSquare,
  Heart,
  ShoppingBag,
} from "lucide-react";
import DashboardStatsCard from "./components/DashboardStatsCard";
import RecentActivityCard from "./components/RecentActivityCard";
import QuickActionsCard from "./components/QuickActionsCard";
import { useDashboardData } from "./hooks/useDashboardData";

export default function AdminPage() {
  const { stats, recentActivity, loading } = useDashboardData();

  const statsConfig = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      subtitle: `${stats.verifiedUsers} verified`,
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-50",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs,
      subtitle: `${stats.publishedBlogs} published`,
      icon: FileText,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-50",
      borderColor: "border-l-green-500",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      subtitle: "Total engagement",
      icon: MessageSquare,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-50",
      borderColor: "border-l-purple-500",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      subtitle: "On all posts",
      icon: Heart,
      iconColor: "text-pink-600",
      iconBgColor: "bg-pink-50",
      borderColor: "border-l-pink-500",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} active`,
      icon: ShoppingBag,
      iconColor: "text-amber-600",
      iconBgColor: "bg-amber-50",
      borderColor: "border-l-amber-500",
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts,
      subtitle: "Total inquiries",
      icon: MessageSquare,
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-50",
      borderColor: "border-l-gray-500",
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statsConfig.map((stat) => (
                <DashboardStatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  icon={stat.icon}
                  iconColor={stat.iconColor}
                  iconBgColor={stat.iconBgColor}
                  borderColor={stat.borderColor}
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <RecentActivityCard activities={recentActivity} />
              <QuickActionsCard />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
