"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardStats } from "@/app/types/user-dashboard";

interface WelcomeSectionProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  stats: DashboardStats;
}

export default function WelcomeSection({ user, stats }: WelcomeSectionProps) {
  return (
    <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-blue-100">
            You have {stats.pendingOrders} pending orders and{" "}
            {stats.loyaltyPoints} loyalty points
          </p>
        </div>
        <div className="hidden md:block">
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-blue-500 text-white text-xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
