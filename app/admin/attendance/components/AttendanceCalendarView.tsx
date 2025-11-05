"use client";

import { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay,
  isSameMonth,
} from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type Employee,
  type AttendanceRecord,
  type Holiday,
  ATTENDANCE_STATUS_CONFIG,
} from "@/types/attendance";

interface AttendanceCalendarViewProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  holidays: Holiday[];
  onEmployeeSelect: (employee: Employee) => void;
}

export default function AttendanceCalendarView({
  employees,
  attendanceRecords,
  holidays,
  onEmployeeSelect,
}: AttendanceCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isDateDetailOpen, setIsDateDetailOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get attendance summary for a specific date
  const getDateAttendanceSummary = (date: Date) => {
    const dayRecords = attendanceRecords.filter((record) =>
      isSameDay(record.date, date)
    );

    const filteredEmployees =
      selectedDepartment === "all"
        ? employees
        : employees.filter((emp) => emp.department === selectedDepartment);

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      onLeave: 0,
      total: filteredEmployees.length,
      records: dayRecords,
    };

    dayRecords.forEach((record) => {
      if (!filteredEmployees.find((emp) => emp.id === record.employeeId))
        return;

      switch (record.status) {
        case "present":
          summary.present++;
          break;
        case "absent":
          summary.absent++;
          break;
        case "late":
          summary.late++;
          break;
        case "sick_leave":
        case "casual_leave":
        case "vacation":
          summary.onLeave++;
          break;
      }
    });

    return summary;
  };

  // Check if date is a holiday
  const isHoliday = (date: Date) => {
    return holidays.some((holiday) => isSameDay(holiday.date, date));
  };

  const getHoliday = (date: Date) => {
    return holidays.find((holiday) => isSameDay(holiday.date, date));
  };

  // Get color intensity based on attendance rate
  const getAttendanceColor = (summary: any) => {
    if (summary.total === 0) return "bg-gray-100";

    const attendanceRate = (summary.present + summary.late) / summary.total;

    if (attendanceRate >= 0.9) return "bg-green-100 border-green-200";
    if (attendanceRate >= 0.7) return "bg-yellow-100 border-yellow-200";
    if (attendanceRate >= 0.5) return "bg-orange-100 border-orange-200";
    return "bg-red-100 border-red-200";
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDateDetailOpen(true);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  );

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold min-w-48 text-center">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-4 text-center font-medium text-sm text-muted-foreground border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const summary = getDateAttendanceSummary(date);
              const holiday = getHoliday(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={index}
                  className={`
                    min-h-28 p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors
                    ${
                      !isCurrentMonth
                        ? "bg-gray-50/50 text-muted-foreground"
                        : ""
                    }
                    ${isTodayDate ? "bg-blue-50 border-blue-200" : ""}
                    ${holiday ? "bg-purple-50 border-purple-200" : ""}
                  `}
                  onClick={() => handleDateClick(date)}>
                  <div className="space-y-1">
                    {/* Date number */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isTodayDate ? "text-blue-600" : ""
                        }`}>
                        {format(date, "d")}
                      </span>
                      {holiday && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-100 text-purple-700">
                          Holiday
                        </Badge>
                      )}
                    </div>

                    {/* Holiday name */}
                    {holiday && (
                      <div className="text-xs text-purple-600 font-medium truncate">
                        {holiday.name}
                      </div>
                    )}

                    {/* Attendance summary */}
                    {isCurrentMonth && !holiday && (
                      <div className="space-y-1">
                        <div
                          className={`
                          rounded-md p-2 border ${getAttendanceColor(summary)}
                        `}>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>{summary.present + summary.late}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span>{summary.absent}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>{summary.onLeave}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-2 h-2" />
                              <span>{summary.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Present/Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">On Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-sm">Holiday</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Click on any date to view detailed attendance records</p>
            <p>
              • Color intensity indicates attendance rate (darker = better
              attendance)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Date Detail Dialog */}
      <Dialog open={isDateDetailOpen} onOpenChange={setIsDateDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance Details -{" "}
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription>
              Detailed attendance records for the selected date
            </DialogDescription>
          </DialogHeader>

          {selectedDate && (
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {/* Summary */}
                {(() => {
                  const summary = getDateAttendanceSummary(selectedDate);
                  const holiday = getHoliday(selectedDate);

                  return (
                    <div>
                      {holiday && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-700">
                              {holiday.type === "national"
                                ? "National Holiday"
                                : "Company Holiday"}
                            </Badge>
                            <span className="font-medium text-purple-700">
                              {holiday.name}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {summary.present + summary.late}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Present
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {summary.absent}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Absent
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {summary.onLeave}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            On Leave
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold">
                            {summary.total}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Employee List */}
                <div className="space-y-2">
                  {employees
                    .filter(
                      (emp) =>
                        selectedDepartment === "all" ||
                        emp.department === selectedDepartment
                    )
                    .map((employee) => {
                      const attendance = attendanceRecords.find(
                        (record) =>
                          record.employeeId === employee.id &&
                          selectedDate &&
                          isSameDay(record.date, selectedDate)
                      );

                      return (
                        <div
                          key={employee.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => onEmployeeSelect(employee)}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback>
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {employee.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {employee.employeeId} • {employee.department}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {attendance ? (
                              <>
                                <Badge
                                  variant="outline"
                                  className={
                                    ATTENDANCE_STATUS_CONFIG[attendance.status]
                                      .color
                                  }>
                                  <span className="mr-1">
                                    {
                                      ATTENDANCE_STATUS_CONFIG[
                                        attendance.status
                                      ].icon
                                    }
                                  </span>
                                  {
                                    ATTENDANCE_STATUS_CONFIG[attendance.status]
                                      .label
                                  }
                                </Badge>
                                {attendance.checkInTime && (
                                  <span className="text-xs text-muted-foreground">
                                    {format(attendance.checkInTime, "HH:mm")}
                                  </span>
                                )}
                              </>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-50 text-gray-600">
                                Not Marked
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
