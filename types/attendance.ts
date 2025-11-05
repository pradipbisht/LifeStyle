// Attendance Management Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  avatar?: string;
  employeeId: string;
  joinDate: Date;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours?: number;
  break1Start?: Date;
  break1End?: Date;
  break2Start?: Date;
  break2End?: Date;
  notes?: string;
  markedBy: string; // admin who marked
  markedAt: Date;
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "early_leave"
  | "half_day"
  | "sick_leave"
  | "casual_leave"
  | "vacation"
  | "holiday"
  | "weekend";

export interface AttendanceFilter {
  dateRange?: {
    from: Date;
    to: Date;
  };
  employee?: string;
  department?: string;
  status?: AttendanceStatus[];
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  attendanceRate: number;
  avgWorkingHours: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: "national" | "company" | "optional";
  description?: string;
  isRecurring: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type:
    | "sick"
    | "casual"
    | "vacation"
    | "maternity"
    | "paternity"
    | "emergency";
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
}

// Status configurations
export const ATTENDANCE_STATUS_CONFIG = {
  present: {
    label: "Present",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✓",
    priority: 1,
  },
  late: {
    label: "Late",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⏰",
    priority: 2,
  },
  half_day: {
    label: "Half Day",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "⚡",
    priority: 3,
  },
  absent: {
    label: "Absent",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "✗",
    priority: 4,
  },
  sick_leave: {
    label: "Sick Leave",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "🏥",
    priority: 5,
  },
  casual_leave: {
    label: "Casual Leave",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🌴",
    priority: 6,
  },
  vacation: {
    label: "Vacation",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "✈️",
    priority: 7,
  },
  holiday: {
    label: "Holiday",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "🎉",
    priority: 8,
  },
  weekend: {
    label: "Weekend",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "🏖️",
    priority: 9,
  },
  early_leave: {
    label: "Early Leave",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    icon: "⏱️",
    priority: 10,
  },
} as const;

export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Customer Support",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
