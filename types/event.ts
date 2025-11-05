import { z } from "zod";

export const EventCategorySchema = z.enum([
  "wellness",
  "fitness",
  "skincare",
  "health",
  "workshop",
  "consultation",
  "webinar",
  "masterclass",
  "nutrition",
  "mental-health",
]);

export const EventLocationSchema = z.object({
  type: z.enum(["online", "physical", "hybrid"]),
  address: z.string().optional(),
  url: z.string().url().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const EventRecurrenceSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]),
  interval: z.number().min(1),
  endDate: z.date().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  count: z.number().optional(),
});

export const EventSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: EventCategorySchema,
  type: z.enum(["single", "recurring"]),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  location: EventLocationSchema,
  capacity: z.number().min(1, "Capacity must be at least 1"),
  registered: z.number().default(0),
  attended: z.number().default(0),
  price: z.number().min(0, "Price cannot be negative"),
  currency: z.string().default("USD"),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
  featured: z.boolean().default(false),
  image: z.string().url().optional(),
  tags: z.array(z.string()),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  recurrence: EventRecurrenceSchema.optional(),
});

export const CreateEventSchema = EventSchema.omit({
  id: true,
  registered: true,
  attended: true,
  createdAt: true,
  updatedAt: true,
});

export type Event = z.infer<typeof EventSchema>;
export type CreateEventData = z.infer<typeof CreateEventSchema>;
export type EventCategory = z.infer<typeof EventCategorySchema>;
export type EventLocation = z.infer<typeof EventLocationSchema>;
export type EventRecurrence = z.infer<typeof EventRecurrenceSchema>;

// Registration and attendance types
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone?: string;
  registeredAt: Date;
  status: "registered" | "cancelled" | "attended" | "no-show" | "waitlist";
  paymentStatus?: "pending" | "paid" | "refunded";
  notes?: string;
  attendanceMarkedAt?: Date;
  attendanceMarkedBy?: string;
}

// Attendance tracking
export interface EventAttendance {
  id: string;
  eventId: string;
  registrationId: string;
  userId: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  attendanceStatus: "present" | "absent" | "late" | "left-early";
  markedBy: string; // admin who marked attendance
  notes?: string;
  createdAt: Date;
}

// Calendar event for display
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: EventCategory;
  status: "draft" | "published" | "cancelled" | "completed";
  featured: boolean;
  registered: number;
  attended: number;
  capacity: number;
  location: EventLocation;
}

// Event filters
export interface EventFilters {
  category?: EventCategory;
  status?: "draft" | "published" | "cancelled" | "completed";
  dateRange?: {
    from: Date;
    to: Date;
  };
  location?: "online" | "physical" | "hybrid";
  featured?: boolean;
  search?: string;
}

// Event analytics
export interface EventAnalytics {
  totalEvents: number;
  publishedEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  totalAttendance: number;
  attendanceRate: number;
  categoryBreakdown: Record<EventCategory, number>;
  monthlyStats: {
    month: string;
    events: number;
    registrations: number;
    attendance: number;
  }[];
}

// Category options with labels and colors
export const EVENT_CATEGORIES = [
  {
    value: "wellness",
    label: "Wellness",
    color: "bg-green-100 text-green-800",
  },
  { value: "fitness", label: "Fitness", color: "bg-blue-100 text-blue-800" },
  { value: "skincare", label: "Skincare", color: "bg-pink-100 text-pink-800" },
  { value: "health", label: "Health", color: "bg-red-100 text-red-800" },
  {
    value: "workshop",
    label: "Workshop",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "consultation",
    label: "Consultation",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "webinar",
    label: "Webinar",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "masterclass",
    label: "Masterclass",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "nutrition",
    label: "Nutrition",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    value: "mental-health",
    label: "Mental Health",
    color: "bg-teal-100 text-teal-800",
  },
] as const;

export const EVENT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  {
    value: "published",
    label: "Published",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
  },
] as const;
