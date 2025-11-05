"use client";

import { useState } from "react";
import { CalendarIcon, Download, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CalendarEvent } from "@/types/event";
import EventAnalyticsDashboard from "../components/EventAnalyticsDashboard";

// Mock data for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Wellness Workshop",
    date: new Date(2024, 10, 15),
    startTime: "10:00",
    endTime: "12:00",
    category: "wellness",
    status: "completed",
    featured: true,
    registered: 25,
    attended: 20,
    capacity: 30,
    location: {
      type: "physical",
      address: "123 Wellness Center",
      city: "New York",
    },
  },
  {
    id: "2",
    title: "Skincare Masterclass",
    date: new Date(2024, 10, 18),
    startTime: "14:00",
    endTime: "16:00",
    category: "skincare",
    status: "published",
    featured: false,
    registered: 15,
    attended: 0,
    capacity: 20,
    location: { type: "online", url: "https://zoom.us/meeting" },
  },
  {
    id: "3",
    title: "Fitness Training",
    date: new Date(2024, 9, 20),
    startTime: "09:00",
    endTime: "10:30",
    category: "fitness",
    status: "completed",
    featured: false,
    registered: 12,
    attended: 10,
    capacity: 15,
    location: { type: "physical", address: "Gym Center", city: "Los Angeles" },
  },
  {
    id: "4",
    title: "Mental Health Webinar",
    date: new Date(2024, 9, 25),
    startTime: "19:00",
    endTime: "20:30",
    category: "mental-health",
    status: "completed",
    featured: true,
    registered: 45,
    attended: 42,
    capacity: 50,
    location: { type: "online", url: "https://zoom.us/meeting" },
  },
  {
    id: "5",
    title: "Nutrition Workshop",
    date: new Date(2024, 9, 30),
    startTime: "11:00",
    endTime: "13:00",
    category: "nutrition",
    status: "completed",
    featured: false,
    registered: 18,
    attended: 16,
    capacity: 25,
    location: {
      type: "hybrid",
      address: "Community Center",
      url: "https://zoom.us/meeting",
    },
  },
];

export default function EventAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter events based on timeframe and category
  const filteredEvents = mockEvents.filter((event) => {
    const now = new Date();
    const eventDate = event.date;

    // Timeframe filter
    let withinTimeframe = true;
    switch (timeframe) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        withinTimeframe = eventDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        withinTimeframe = eventDate >= monthAgo;
        break;
      case "quarter":
        const quarterAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        withinTimeframe = eventDate >= quarterAgo;
        break;
      case "year":
        const yearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        withinTimeframe = eventDate >= yearAgo;
        break;
    }

    // Category filter
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    return withinTimeframe && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics for your events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Settings
          </CardTitle>
          <CardDescription>
            Customize your analytics view with filters and time ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select
                value={timeframe}
                onValueChange={(value) => setTimeframe(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="mt-6">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <EventAnalyticsDashboard events={filteredEvents} timeframe={timeframe} />

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
          <CardDescription>
            Important trends and recommendations based on your event data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">
                🎯 High Attendance Rate
              </h4>
              <p className="text-sm text-blue-700">
                Your events are performing well with an average attendance rate
                of{" "}
                {filteredEvents.length > 0
                  ? Math.round(
                      (filteredEvents.reduce((sum, e) => sum + e.attended, 0) /
                        filteredEvents.reduce(
                          (sum, e) => sum + e.registered,
                          0
                        )) *
                        100
                    )
                  : 0}
                %. Keep up the great work!
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <h4 className="font-medium text-green-900 mb-2">
                📈 Popular Categories
              </h4>
              <p className="text-sm text-green-700">
                Mental Health and Wellness events show the highest engagement
                rates. Consider scheduling more events in these categories.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">
                💡 Optimization Opportunity
              </h4>
              <p className="text-sm text-yellow-700">
                Online events tend to have higher registration rates but
                slightly lower attendance. Consider hybrid formats to maximize
                both metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
