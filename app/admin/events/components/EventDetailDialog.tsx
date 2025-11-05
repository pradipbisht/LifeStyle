"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Download,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_OPTIONS,
  type CalendarEvent,
  type EventRegistration,
} from "@/types/event";
import { format } from "date-fns";

interface EventDetailDialogProps {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock registration data
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
  {
    id: "4",
    eventId: "1",
    userId: "user4",
    userName: "David Wilson",
    userEmail: "david@example.com",
    phone: "+1-555-0789",
    registeredAt: new Date(2024, 10, 1),
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: "5",
    eventId: "1",
    userId: "user5",
    userName: "Eva Brown",
    userEmail: "eva@example.com",
    registeredAt: new Date(2024, 10, 5),
    status: "waitlist",
    paymentStatus: "pending",
  },
];

export default function EventDetailDialog({
  event,
  open,
  onOpenChange,
}: EventDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkAction, setBulkAction] = useState("");

  const getCategoryColor = (category: string) => {
    const categoryConfig = EVENT_CATEGORIES.find((c) => c.value === category);
    return categoryConfig?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const statusConfig = EVENT_STATUS_OPTIONS.find((s) => s.value === status);
    return statusConfig?.color || "bg-gray-100 text-gray-800";
  };

  const getLocationDisplay = () => {
    if (event.location.type === "online") {
      return "Online Event";
    } else if (event.location.type === "physical") {
      return event.location.address || "Physical Location";
    } else {
      return "Hybrid Event";
    }
  };

  const getRegistrationStatusColor = (status: EventRegistration["status"]) => {
    switch (status) {
      case "attended":
        return "bg-green-100 text-green-800";
      case "registered":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-yellow-100 text-yellow-800";
      case "waitlist":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRegistrationStatusIcon = (status: EventRegistration["status"]) => {
    switch (status) {
      case "attended":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "registered":
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "no-show":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "waitlist":
        return <Clock className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleMarkAttendance = (
    registrationId: string,
    status: "attended" | "no-show"
  ) => {
    // TODO: Implement attendance marking
    console.log(`Mark ${registrationId} as ${status}`);
  };

  const handleUpdateStatus = (
    registrationId: string,
    newStatus: EventRegistration["status"]
  ) => {
    // TODO: Implement status update
    console.log(`Update ${registrationId} to ${newStatus}`);
  };

  const filteredRegistrations = mockRegistrations.filter(
    (reg) =>
      reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const registrationStats = {
    total: mockRegistrations.length,
    attended: mockRegistrations.filter((r) => r.status === "attended").length,
    registered: mockRegistrations.filter((r) => r.status === "registered")
      .length,
    cancelled: mockRegistrations.filter((r) => r.status === "cancelled").length,
    noShow: mockRegistrations.filter((r) => r.status === "no-show").length,
    waitlist: mockRegistrations.filter((r) => r.status === "waitlist").length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <DialogDescription className="text-base">
                Event details, registrations, and attendance management
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getCategoryColor(event.category)}>
                {
                  EVENT_CATEGORIES.find((c) => c.value === event.category)
                    ?.label
                }
              </Badge>
              <Badge variant="outline" className={getStatusColor(event.status)}>
                {
                  EVENT_STATUS_OPTIONS.find((s) => s.value === event.status)
                    ?.label
                }
              </Badge>
              {event.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registrations">
              Registrations ({mockRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Event Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Event Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Date
                        </Label>
                        <p className="font-medium">
                          {format(event.date, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Time
                        </Label>
                        <p className="font-medium">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Location
                      </Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{getLocationDisplay()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Capacity
                        </Label>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {event.capacity} attendees
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Registration
                        </Label>
                        <p className="font-medium">
                          {event.registered}/{event.capacity} registered (
                          {Math.round(
                            (event.registered / event.capacity) * 100
                          )}
                          % full)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Manage your event efficiently
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Attendees
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email to All
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Mark All Present
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total
                        </span>
                        <span className="font-medium">
                          {registrationStats.total}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Attended
                        </span>
                        <span className="font-medium text-green-600">
                          {registrationStats.attended}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Registered
                        </span>
                        <span className="font-medium text-blue-600">
                          {registrationStats.registered}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          No Show
                        </span>
                        <span className="font-medium text-yellow-600">
                          {registrationStats.noShow}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Cancelled
                        </span>
                        <span className="font-medium text-red-600">
                          {registrationStats.cancelled}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Waitlist
                        </span>
                        <span className="font-medium text-purple-600">
                          {registrationStats.waitlist}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {registrationStats.total > 0
                          ? Math.round(
                              (registrationStats.attended /
                                registrationStats.total) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {registrationStats.attended} of{" "}
                        {registrationStats.total} attended
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Event Registrations</CardTitle>
                    <CardDescription>
                      Manage attendee registrations and status
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search attendees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Attendee</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {registration.userName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {registration.userName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ID: {registration.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{registration.userEmail}</span>
                              </div>
                              {registration.phone && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{registration.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-sm">
                              <p>
                                {format(
                                  registration.registeredAt,
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {format(registration.registeredAt, "h:mm a")}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRegistrationStatusIcon(registration.status)}
                              <Badge
                                variant="outline"
                                className={getRegistrationStatusColor(
                                  registration.status
                                )}>
                                {registration.status.replace("-", " ")}
                              </Badge>
                            </div>
                            {registration.attendanceMarkedAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Marked:{" "}
                                {format(
                                  registration.attendanceMarkedAt,
                                  "MMM d, h:mm a"
                                )}
                              </p>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                registration.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : registration.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }>
                              {registration.paymentStatus}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMarkAttendance(
                                      registration.id,
                                      "attended"
                                    )
                                  }>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Attended
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMarkAttendance(
                                      registration.id,
                                      "no-show"
                                    )
                                  }>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark as No Show
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      registration.id,
                                      "cancelled"
                                    )
                                  }>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Cancel Registration
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>
                  Track and manage attendee check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Attendance Tracking
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced attendance features coming soon
                  </p>
                  <Button variant="outline">Enable Check-in System</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Analytics</CardTitle>
                <CardDescription>
                  Detailed insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive analytics and reporting features coming soon
                  </p>
                  <Button variant="outline">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
