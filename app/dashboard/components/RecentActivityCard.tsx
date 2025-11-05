"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Package, Star, Gift, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { RecentActivity } from "@/app/types/user-dashboard";

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

export default function RecentActivityCard({
  activities,
}: RecentActivityCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-blue-100 p-2 rounded-full">
                {activity.icon === "Package" && (
                  <Package className="h-4 w-4 text-blue-600" />
                )}
                {activity.icon === "Star" && (
                  <Star className="h-4 w-4 text-blue-600" />
                )}
                {activity.icon === "Gift" && (
                  <Gift className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
              {activity.url && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={activity.url}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/activity">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
