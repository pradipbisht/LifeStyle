"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Edit,
  ArrowLeft,
  Download,
  Mail,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_OPTIONS,
  type CalendarEvent,
  type EventRegistration,
} from "@/types/event";
import { format } from "date-fns";
import Link from "next/link";
import AttendanceTracker from "../components/AttendanceTracker";

// Mock data - in a real app, this would be fetched based on the ID
const mockEvent: CalendarEvent = {
  id: "1",
  title: "Advanced Wellness Workshop: Mind-Body Connection",
  date: new Date(2024, 10, 15),
  startTime: "10:00",
  endTime: "12:00",
  category: "wellness",
  status: "published",
  featured: true,
  registered: 25,
  attended: 20,
  capacity: 30,
  location: {
    type: "hybrid",
    address: "123 Wellness Center, Downtown District",
    city: "New York",
    url: "https://zoom.us/j/123456789",
  },
};

const mockRegistrations: EventRegistration[] = [
  {
    id: "1",
    eventId: "1",
    userId: "user1",
    userName: "Alice Johnson",
    userEmail: "alice@example.com",
    phone: "+1-555-0123",
    registeredAt: new Date(2024, 9, 10),
    status: "attended",
    paymentStatus: "paid",
    attendanceMarkedAt: new Date(2024, 10, 15, 10, 15),
    attendanceMarkedBy: "admin",
  },
  {
    id: "2",
    eventId: "1",
    userId: "user2",
    userName: "Bob Smith",
    userEmail: "bob@example.com",
    phone: "+1-555-0456",
    registeredAt: new Date(2024, 9, 12),
    status: "registered",
    paymentStatus: "paid",
  },
  {
    id: "3",
    eventId: "1",
    userId: "user3",
    userName: "Carol Davis",
    userEmail: "carol@example.com",
    registeredAt: new Date(2024, 9, 15),
    status: "no-show",
    paymentStatus: "paid",
    attendanceMarkedAt: new Date(2024, 10, 15, 12, 0),
    attendanceMarkedBy: "admin",
  },
];

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  const getCategoryColor = (category: string) => {
    const categoryConfig = EVENT_CATEGORIES.find((c) => c.value === category);
    return categoryConfig?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const statusConfig = EVENT_STATUS_OPTIONS.find((s) => s.value === status);
    return statusConfig?.color || "bg-gray-100 text-gray-800";
  };

  const getLocationDisplay = () => {
    if (mockEvent.location.type === "online") {
      return "Online Event";
    } else if (mockEvent.location.type === "physical") {
      return mockEvent.location.address || "Physical Location";
    } else {
      return "Hybrid Event";
    }
  };

  const handleUpdateAttendance = (
    registrationId: string,
    status: "attended" | "no-show"
  ) => {
    // TODO: Implement attendance update
    console.log(`Update attendance for ${registrationId}: ${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mockEvent.title}
            </h1>
            <p className="text-muted-foreground">
              Event ID: {eventId} • Manage all aspects of this event
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getCategoryColor(mockEvent.category)}>
            {
              EVENT_CATEGORIES.find((c) => c.value === mockEvent.category)
                ?.label
            }
          </Badge>
          <Badge variant="outline" className={getStatusColor(mockEvent.status)}>
            {
              EVENT_STATUS_OPTIONS.find((s) => s.value === mockEvent.status)
                ?.label
            }
          </Badge>
          {mockEvent.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvent.registered}</div>
            <p className="text-xs text-muted-foreground">
              of {mockEvent.capacity} capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvent.attended}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockEvent.attended / mockEvent.registered) * 100)}%
              attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockEvent.registered / mockEvent.capacity) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mockEvent.capacity - mockEvent.registered} spots available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Date</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {format(mockEvent.date, "MMM d")}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockEvent.startTime} - {mockEvent.endTime}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">
            Attendees ({mockRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                  <CardDescription>
                    Complete details about this event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Date & Time
                      </label>
                      <p className="font-medium">
                        {format(mockEvent.date, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mockEvent.startTime} - {mockEvent.endTime}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Location
                      </label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{getLocationDisplay()}</p>
                          {mockEvent.location.type === "hybrid" && (
                            <p className="text-sm text-muted-foreground">
                              + Online access available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Category
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={getCategoryColor(mockEvent.category)}>
                          {
                            EVENT_CATEGORIES.find(
                              (c) => c.value === mockEvent.category
                            )?.label
                          }
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={getStatusColor(mockEvent.status)}>
                          {
                            EVENT_STATUS_OPTIONS.find(
                              (s) => s.value === mockEvent.status
                            )?.label
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Event
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export List
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email All
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registration Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Attended</span>
                    <span className="font-medium text-green-600">
                      {
                        mockRegistrations.filter((r) => r.status === "attended")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Registered</span>
                    <span className="font-medium text-blue-600">
                      {
                        mockRegistrations.filter(
                          (r) => r.status === "registered"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">No Show</span>
                    <span className="font-medium text-yellow-600">
                      {
                        mockRegistrations.filter((r) => r.status === "no-show")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cancelled</span>
                    <span className="font-medium text-red-600">
                      {
                        mockRegistrations.filter(
                          (r) => r.status === "cancelled"
                        ).length
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round(
                        (mockEvent.attended / mockEvent.registered) * 100
                      )}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Attendance Rate
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (mockEvent.registered / mockEvent.capacity) * 100
                      )}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Capacity Filled
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Attendees</CardTitle>
              <CardDescription>
                All participants registered for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {registration.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{registration.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {registration.userEmail}
                        </p>
                        {registration.phone && (
                          <p className="text-sm text-muted-foreground">
                            {registration.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          registration.status === "attended"
                            ? "bg-green-100 text-green-800"
                            : registration.status === "registered"
                            ? "bg-blue-100 text-blue-800"
                            : registration.status === "no-show"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }>
                        {registration.status.replace("-", " ")}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {format(registration.registeredAt, "MMM d")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTracker
            eventId={eventId}
            registrations={mockRegistrations}
            onUpdateAttendance={handleUpdateAttendance}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>
                Configure event-specific settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Event Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced event configuration options coming soon
                </p>
                <Button variant="outline">Configure Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
