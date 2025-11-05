"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Download,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CalendarEvent,
  type EventAnalytics,
  EVENT_CATEGORIES,
} from "@/types/event";

interface EventAnalyticsDashboardProps {
  events: CalendarEvent[];
  timeframe?: "week" | "month" | "quarter" | "year";
}

export default function EventAnalyticsDashboard({
  events,
  timeframe = "month",
}: EventAnalyticsDashboardProps) {
  // Calculate analytics
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const completedEvents = events.filter((e) => e.status === "completed").length;
  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.registered,
    0
  );
  const totalAttendance = events.reduce(
    (sum, event) => sum + event.attended,
    0
  );
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);

  const attendanceRate =
    totalRegistrations > 0
      ? Math.round((totalAttendance / totalRegistrations) * 100)
      : 0;
  const utilizationRate =
    totalCapacity > 0
      ? Math.round((totalRegistrations / totalCapacity) * 100)
      : 0;

  // Category breakdown
  const categoryStats = EVENT_CATEGORIES.map((category) => {
    const categoryEvents = events.filter((e) => e.category === category.value);
    const registrations = categoryEvents.reduce(
      (sum, e) => sum + e.registered,
      0
    );
    const attendance = categoryEvents.reduce((sum, e) => sum + e.attended, 0);

    return {
      category: category.label,
      value: category.value,
      color: category.color,
      events: categoryEvents.length,
      registrations,
      attendance,
      attendanceRate:
        registrations > 0 ? Math.round((attendance / registrations) * 100) : 0,
    };
  }).filter((stat) => stat.events > 0);

  // Performance metrics
  const topPerformingEvents = [...events]
    .sort((a, b) => {
      const aRate = a.registered > 0 ? a.attended / a.registered : 0;
      const bRate = b.registered > 0 ? b.attended / b.registered : 0;
      return bRate - aRate;
    })
    .slice(0, 5);

  const upcomingEvents = events.filter(
    (e) => e.status === "published" && e.date >= new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Event Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your event performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {publishedEvents} published, {upcomingEvents} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              {utilizationRate}% capacity utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <div className="flex items-center text-xs">
              {attendanceRate >= 70 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  attendanceRate >= 70 ? "text-green-600" : "text-red-600"
                }>
                {totalAttendance} of {totalRegistrations} attended
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEvents > 0
                ? Math.round((completedEvents / totalEvents) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {completedEvents} of {totalEvents} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Performance by Category
            </CardTitle>
            <CardDescription>
              Event performance broken down by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No event data available
                </p>
              ) : (
                categoryStats.map((stat) => (
                  <div key={stat.value} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={stat.color}>
                          {stat.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {stat.events} events
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        {stat.attendanceRate}% attendance
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Events: </span>
                        <span className="font-medium">{stat.events}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Registrations:{" "}
                        </span>
                        <span className="font-medium">
                          {stat.registrations}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Attendance:{" "}
                        </span>
                        <span className="font-medium">{stat.attendance}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${stat.attendanceRate}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Events
            </CardTitle>
            <CardDescription>
              Events with the highest attendance rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No completed events to analyze
                </p>
              ) : (
                topPerformingEvents.map((event, index) => {
                  const attendanceRate =
                    event.registered > 0
                      ? Math.round((event.attended / event.registered) * 100)
                      : 0;
                  const categoryConfig = EVENT_CATEGORIES.find(
                    (c) => c.value === event.category
                  );

                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={categoryConfig?.color}>
                              {categoryConfig?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {event.date.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">
                          {attendanceRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.attended}/{event.registered}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>
            Comprehensive breakdown of event performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Average Attendance Rate
              </Label>
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                Across all completed events
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Average Event Size
              </Label>
              <div className="text-2xl font-bold">
                {totalEvents > 0
                  ? Math.round(totalRegistrations / totalEvents)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Registrations per event
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Capacity Utilization
              </Label>
              <div className="text-2xl font-bold">{utilizationRate}%</div>
              <p className="text-xs text-muted-foreground">
                Of total event capacity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
