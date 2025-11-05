import {
  format,
  parseISO,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  isPast,
  isFuture,
} from "date-fns";

export const formatDate = (
  date: Date | string,
  formatString: string = "PPP"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateTime = (date: Date, time: string): string => {
  return `${formatDate(date, "PPP")} at ${formatTime(time)}`;
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  if (isSameDay(startDate, endDate)) {
    return formatDate(startDate, "PPP");
  }

  if (isSameMonth(startDate, endDate)) {
    return `${formatDate(startDate, "MMM d")} - ${formatDate(
      endDate,
      "d, yyyy"
    )}`;
  }

  return `${formatDate(startDate, "MMM d")} - ${formatDate(
    endDate,
    "MMM d, yyyy"
  )}`;
};

export const getCalendarDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const isEventDay = (date: Date, eventDate: Date): boolean => {
  return isSameDay(date, eventDate);
};

export const getEventStatus = (
  startDate: Date,
  endDate: Date,
  status: string
) => {
  if (status === "cancelled") return "cancelled";
  if (status === "draft") return "draft";

  if (isPast(endDate)) return "completed";
  if (isFuture(startDate)) return "upcoming";

  return "ongoing";
};

export const getTimeSlots = (interval: number = 30): string[] => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const validateTimeRange = (
  startTime: string,
  endTime: string
): boolean => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return endMinutes > startMinutes;
};

export const calculateDuration = (
  startTime: string,
  endTime: string
): string => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const durationMinutes = endMinutes - startMinutes;

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const getNextRecurrenceDate = (
  startDate: Date,
  frequency: "daily" | "weekly" | "monthly",
  interval: number = 1
): Date => {
  switch (frequency) {
    case "daily":
      return addDays(startDate, interval);
    case "weekly":
      return addDays(startDate, interval * 7);
    case "monthly":
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + interval);
      return nextMonth;
    default:
      return startDate;
  }
};

export const isEventUpcoming = (startDate: Date): boolean => {
  return isFuture(startDate);
};

export const isEventToday = (startDate: Date): boolean => {
  return isToday(startDate);
};

export const getDaysUntilEvent = (startDate: Date): number => {
  const today = new Date();
  const diffTime = startDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getEventTimeStatus = (
  startDate: Date,
  endDate: Date
): {
  status: "upcoming" | "live" | "ended";
  label: string;
  color: string;
} => {
  const now = new Date();

  if (now < startDate) {
    const days = getDaysUntilEvent(startDate);
    if (days === 0) {
      return { status: "upcoming", label: "Today", color: "text-blue-600" };
    } else if (days === 1) {
      return { status: "upcoming", label: "Tomorrow", color: "text-blue-600" };
    } else {
      return {
        status: "upcoming",
        label: `In ${days} days`,
        color: "text-gray-600",
      };
    }
  }

  if (now >= startDate && now <= endDate) {
    return { status: "live", label: "Live Now", color: "text-green-600" };
  }

  return { status: "ended", label: "Ended", color: "text-gray-500" };
};
