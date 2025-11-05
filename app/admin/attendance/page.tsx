"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Filter,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Coffee,
  Plane,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
  DialogTrigger,
} from "@/components/ui/dialog";
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
  type Employee,
  type AttendanceRecord,
  type AttendanceStatus,
  type Holiday,
  ATTENDANCE_STATUS_CONFIG,
  DEPARTMENTS,
} from "@/types/attendance";
import {
  employeeService,
  attendanceService,
  holidayService,
} from "@/lib/services/attendanceService";
import AttendanceStatsCards from "./components/AttendanceStatsCards";
import ManageEmployeesDialog from "./components/ManageEmployeesDialog";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "calendar">("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">(
    "all"
  );

  // Real data from Firebase
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isManageEmployeesOpen, setIsManageEmployeesOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load data from Firebase
  // Load data from Firebase
  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Loading attendance data...");

      const [employeesData, holidaysData] = await Promise.all([
        employeeService.getAll(),
        holidayService.getAll(),
      ]);

      console.log("Loaded employees:", employeesData);
      console.log("Loaded holidays:", holidaysData);

      // Get attendance records for current month
      const startOfCurrentMonth = startOfMonth(new Date());
      const endOfCurrentMonth = endOfMonth(new Date());
      const attendanceData = await attendanceService.getByDateRange(
        startOfCurrentMonth,
        endOfCurrentMonth
      );

      console.log("Loaded attendance records:", attendanceData);

      setEmployees(employeesData);
      setAttendanceRecords(attendanceData);
      setHolidays(holidaysData);
    } catch (error) {
      console.error("Error loading attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data without full page reload
  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }; // Calculate today's stats
  const todayRecords = attendanceRecords.filter((record) =>
    isToday(record.date)
  );

  const stats = {
    totalEmployees: employees.length,
    presentToday: todayRecords.filter((r) => r.status === "present").length,
    absentToday: todayRecords.filter((r) => r.status === "absent").length,
    lateToday: todayRecords.filter((r) => r.status === "late").length,
    onLeaveToday: todayRecords.filter((r) =>
      ["sick_leave", "casual_leave", "vacation"].includes(r.status)
    ).length,
    attendanceRate: 0,
  };

  stats.attendanceRate =
    stats.totalEmployees > 0
      ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
      : 0;

  // Filter employees and their attendance for selected date
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getEmployeeAttendance = (employeeId: string, date: Date) => {
    return attendanceRecords.find(
      (record) =>
        record.employeeId === employeeId && isSameDay(record.date, date)
    );
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return "--";
    return format(date, "HH:mm");
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const config = ATTENDANCE_STATUS_CONFIG[status];
    return (
      <Badge variant="outline" className={config.color}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 ml-4 mr-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => setIsManageEmployeesOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Manage Employees
          </Button>
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading attendance data...</span>
        </div>
      ) : (
        <>
          {/* Debug Info - Remove this in production */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">
                Debug Info (Remove in production)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Employees loaded: {employees.length}</p>
              <p>Attendance records: {attendanceRecords.length}</p>
              <p>Holidays: {holidays.length}</p>

              {/* Test Employee Creation Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    console.log("Testing direct employee creation...");
                    const testEmployee = {
                      name: "Test Employee " + Date.now(),
                      email: `test${Date.now()}@company.com`,
                      department: "Engineering",
                      position: "Test Position",
                      employeeId: "TEST" + Date.now(),
                      joinDate: new Date(),
                      isActive: true,
                    };

                    const result = await employeeService.create(testEmployee);
                    console.log("Test employee created:", result);
                    alert("Test employee created successfully!");
                    loadData(); // Refresh data
                  } catch (error) {
                    console.error("Test employee creation failed:", error);
                    alert("Test employee creation failed: " + error);
                  }
                }}>
                Test Create Employee
              </Button>

              {employees.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Sample employee:</p>
                  <pre className="text-xs bg-white p-2 rounded mt-1">
                    {JSON.stringify(employees[0], null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <AttendanceStatsCards stats={stats} />

          {/* Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.entries(ATTENDANCE_STATUS_CONFIG).map(
                        ([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <span className="mr-2">{config.icon}</span>
                            {config.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Tabs
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as any)}>
                  <TabsList>
                    <TabsTrigger value="daily">Daily View</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content */}
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="daily" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Daily Attendance -{" "}
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </CardTitle>
                      <CardDescription>
                        Employee attendance records for the selected date
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedDate(
                            new Date(
                              selectedDate.getTime() - 24 * 60 * 60 * 1000
                            )
                          )
                        }>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(new Date())}>
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedDate(
                            new Date(
                              selectedDate.getTime() + 24 * 60 * 60 * 1000
                            )
                          )
                        }>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Working Hours</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => {
                          const attendance = getEmployeeAttendance(
                            employee.id,
                            selectedDate
                          );
                          return (
                            <TableRow key={employee.id}>
                              <TableCell>
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
                                      {employee.employeeId}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {employee.department}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {attendance ? (
                                  getStatusBadge(attendance.status)
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-50 text-gray-600">
                                    Not Marked
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {formatTime(attendance?.checkInTime)}
                              </TableCell>
                              <TableCell>
                                {formatTime(attendance?.checkOutTime)}
                              </TableCell>
                              <TableCell>
                                {attendance?.workingHours
                                  ? `${attendance.workingHours}h`
                                  : "--"}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {attendance?.notes || "--"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  {attendance ? "Edit" : "Mark"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                  <CardDescription>
                    Calendar view will be implemented here with full attendance
                    marking capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                    <p className="text-muted-foreground">
                      Full calendar view with attendance marking capabilities
                      coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Manage Employees Dialog */}
      <ManageEmployeesDialog
        open={isManageEmployeesOpen}
        onOpenChange={setIsManageEmployeesOpen}
        onEmployeesUpdated={loadData}
      />
    </div>
  );
}
