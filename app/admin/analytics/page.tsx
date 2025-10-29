"use client";

import AdminLayout from "../AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1
            className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
            Analytics
          </h1>
          <p className="text-gray-600">
            Track your platform's performance and user engagement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardDescription>Page Views</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                12,345
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+15% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                1,234
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+8% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Engagement Rate</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                68%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+3% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Avg. Session</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-orange-600" />
                5:32
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">+12% from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Coming soon - Detailed analytics and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-gray-400">
              <p>Chart placeholder - Integration coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
