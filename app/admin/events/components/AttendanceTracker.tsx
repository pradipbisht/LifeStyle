"use client";

import { useState } from "react";
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  QrCode,
  Smartphone,
  Download,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type EventRegistration } from "@/types/event";
import { format } from "date-fns";

interface AttendanceTrackerProps {
  eventId: string;
  registrations: EventRegistration[];
  onUpdateAttendance: (
    registrationId: string,
    status: "attended" | "no-show"
  ) => void;
}

export default function AttendanceTracker({
  eventId,
  registrations,
  onUpdateAttendance,
}: AttendanceTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "registered" | "attended" | "no-show"
  >("all");
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: registrations.length,
    attended: registrations.filter((r) => r.status === "attended").length,
    registered: registrations.filter((r) => r.status === "registered").length,
    noShow: registrations.filter((r) => r.status === "no-show").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;

  const handleQuickAttendance = (
    registrationId: string,
    status: "attended" | "no-show"
  ) => {
    onUpdateAttendance(registrationId, status);
  };

  const handleBulkMarkAttended = () => {
    const registeredUsers = filteredRegistrations.filter(
      (r) => r.status === "registered"
    );
    registeredUsers.forEach((reg) => {
      onUpdateAttendance(reg.id, "attended");
    });
  };

  const getStatusColor = (status: EventRegistration["status"]) => {
    switch (status) {
      case "attended":
        return "bg-green-100 text-green-800";
      case "registered":
        return "bg-blue-100 text-blue-800";
      case "no-show":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registered
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.attended}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Show</CardTitle>
            <XCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.noShow}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attendance Management</CardTitle>
              <CardDescription>
                Track and manage attendee check-ins for this event
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Check-in
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>QR Code Check-in</DialogTitle>
                    <DialogDescription>
                      Generate QR codes for easy attendee check-in
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-center py-8">
                    <QrCode className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      QR code generation coming soon
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={handleBulkMarkAttended} size="sm">
                <UserCheck className="h-4 w-4 mr-2" />
                Mark All Present
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attendance Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Registration Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground">
                      No attendees found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
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
                              {registration.userEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <p>{format(registration.registeredAt, "MMM d")}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(registration.registeredAt, "h:mm a")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(registration.status)}>
                          {registration.status === "no-show"
                            ? "No Show"
                            : registration.status.charAt(0).toUpperCase() +
                              registration.status.slice(1)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {registration.attendanceMarkedAt ? (
                          <div className="text-sm">
                            <p>
                              {format(registration.attendanceMarkedAt, "MMM d")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(
                                registration.attendanceMarkedAt,
                                "h:mm a"
                              )}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Not checked in
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {registration.status === "registered" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-green-600 hover:text-green-700"
                                onClick={() =>
                                  handleQuickAttendance(
                                    registration.id,
                                    "attended"
                                  )
                                }>
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-yellow-600 hover:text-yellow-700"
                                onClick={() =>
                                  handleQuickAttendance(
                                    registration.id,
                                    "no-show"
                                  )
                                }>
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          {registration.status === "attended" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-blue-600 hover:text-blue-700"
                              onClick={() =>
                                handleQuickAttendance(
                                  registration.id,
                                  "no-show"
                                )
                              }>
                              <UserX className="h-3 w-3" />
                            </Button>
                          )}
                          {registration.status === "no-show" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-green-600 hover:text-green-700"
                              onClick={() =>
                                handleQuickAttendance(
                                  registration.id,
                                  "attended"
                                )
                              }>
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
