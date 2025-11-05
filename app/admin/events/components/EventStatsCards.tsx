"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, UserCheck, TrendingUp } from "lucide-react";
import { type CalendarEvent } from "@/types/event";

interface EventStatsCardsProps {
  events: CalendarEvent[];
}

export default function EventStatsCards({ events }: EventStatsCardsProps) {
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.registered,
    0
  );
  const totalAttendance = events.reduce(
    (sum, event) => sum + event.attended,
    0
  );
  const attendanceRate =
    totalRegistrations > 0
      ? Math.round((totalAttendance / totalRegistrations) * 100)
      : 0;

  const upcomingEvents = events.filter(
    (e) => e.status === "published" && e.date >= new Date()
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Events
          </CardTitle>
          <CalendarIcon className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-blue-600">{totalEvents}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {publishedEvents} published
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Upcoming Events
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-green-600">
            {upcomingEvents}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            In the next 30 days
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Registrations
          </CardTitle>
          <Users className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-purple-600">
            {totalRegistrations}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Across all events
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Attendance Rate
          </CardTitle>
          <UserCheck className="h-5 w-5 text-orange-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-orange-600">
            {attendanceRate}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {totalAttendance} of {totalRegistrations} attended
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
