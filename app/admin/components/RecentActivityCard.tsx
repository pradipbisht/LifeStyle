import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  FileText,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: "user" | "blog" | "comment" | "product";
}

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

export default function RecentActivityCard({
  activities,
}: RecentActivityCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "blog":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case "product":
        return <ShoppingBag className="h-4 w-4 text-amber-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest actions on your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
