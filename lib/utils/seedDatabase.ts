import {
  employeeService,
  attendanceService,
  holidayService,
} from "../services/attendanceService";
import { eventService } from "../services/eventService";
import { type Employee, type Holiday } from "@/types/attendance";

// Sample employees data
const sampleEmployees: Omit<Employee, "id">[] = [
  {
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1-555-0123",
    department: "Engineering",
    position: "Senior Developer",
    employeeId: "EMP001",
    joinDate: new Date(2023, 0, 15),
    isActive: true,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0456",
    department: "Marketing",
    position: "Marketing Manager",
    employeeId: "EMP002",
    joinDate: new Date(2023, 2, 10),
    isActive: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Mike Davis",
    email: "mike.davis@company.com",
    phone: "+1-555-0789",
    department: "Sales",
    position: "Sales Representative",
    employeeId: "EMP003",
    joinDate: new Date(2023, 5, 20),
    isActive: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Emily Brown",
    email: "emily.brown@company.com",
    department: "HR",
    position: "HR Specialist",
    employeeId: "EMP004",
    joinDate: new Date(2023, 8, 5),
    isActive: true,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Engineering",
    position: "Frontend Developer",
    employeeId: "EMP005",
    joinDate: new Date(2024, 1, 1),
    isActive: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

// Sample holidays
const sampleHolidays: Omit<Holiday, "id">[] = [
  {
    name: "New Year's Day",
    date: new Date(2025, 0, 1),
    type: "national",
    isRecurring: true,
  },
  {
    name: "Independence Day",
    date: new Date(2025, 6, 4),
    type: "national",
    isRecurring: true,
  },
  {
    name: "Christmas Day",
    date: new Date(2025, 11, 25),
    type: "national",
    isRecurring: true,
  },
  {
    name: "Company Foundation Day",
    date: new Date(2025, 11, 15),
    type: "company",
    isRecurring: true,
  },
];

// Sample events data
const sampleEvents = [
  {
    title: "Wellness Workshop",
    description:
      "A comprehensive workshop focusing on mental and physical wellness in the workplace.",
    category: "wellness" as const,
    type: "single" as const,
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 0, 15),
    date: new Date(2025, 0, 15),
    startTime: "10:00",
    endTime: "12:00",
    location: {
      type: "physical" as const,
      address: "123 Wellness Center",
      city: "New York",
      country: "USA",
    },
    capacity: 30,
    price: 0,
    currency: "USD",
    status: "published" as const,
    featured: true,
    tags: ["wellness", "mental-health", "workshop"],
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    createdBy: "admin",
  },
  {
    title: "Skincare Masterclass",
    description:
      "Learn the fundamentals of skincare routines and product selection with industry experts.",
    category: "skincare" as const,
    type: "single" as const,
    startDate: new Date(2025, 0, 18),
    endDate: new Date(2025, 0, 18),
    date: new Date(2025, 0, 18),
    startTime: "14:00",
    endTime: "16:00",
    location: {
      type: "online" as const,
      url: "https://zoom.us/meeting",
    },
    capacity: 20,
    price: 25,
    currency: "USD",
    status: "published" as const,
    featured: false,
    tags: ["skincare", "beauty", "masterclass"],
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop",
    createdBy: "admin",
  },
  {
    title: "Fitness Training Session",
    description:
      "High-intensity interval training session suitable for all fitness levels.",
    category: "fitness" as const,
    type: "recurring" as const,
    startDate: new Date(2025, 0, 20),
    endDate: new Date(2025, 0, 20),
    date: new Date(2025, 0, 20),
    startTime: "09:00",
    endTime: "10:30",
    location: {
      type: "physical" as const,
      address: "Gym Center",
      city: "Los Angeles",
      country: "USA",
    },
    capacity: 15,
    price: 15,
    currency: "USD",
    status: "published" as const,
    featured: true,
    tags: ["fitness", "training", "hiit"],
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    createdBy: "admin",
  },
  {
    title: "Nutrition Workshop",
    description:
      "Understanding macronutrients and creating balanced meal plans for optimal health.",
    category: "wellness" as const,
    type: "single" as const,
    startDate: new Date(2025, 0, 25),
    endDate: new Date(2025, 0, 25),
    date: new Date(2025, 0, 25),
    startTime: "11:00",
    endTime: "13:00",
    location: {
      type: "hybrid" as const,
      address: "Conference Room A",
      city: "San Francisco",
      country: "USA",
      url: "https://zoom.us/nutrition-workshop",
    },
    capacity: 25,
    price: 0,
    currency: "USD",
    status: "draft" as const,
    featured: false,
    tags: ["nutrition", "health", "workshop"],
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
    createdBy: "admin",
  },
];

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Seed employees
    console.log("Seeding employees...");
    for (const employee of sampleEmployees) {
      try {
        await employeeService.create(employee);
        console.log(`Created employee: ${employee.name}`);
      } catch (error) {
        console.error(`Error creating employee ${employee.name}:`, error);
      }
    }

    // Seed holidays
    console.log("Seeding holidays...");
    for (const holiday of sampleHolidays) {
      try {
        await holidayService.create(holiday);
        console.log(`Created holiday: ${holiday.name}`);
      } catch (error) {
        console.error(`Error creating holiday ${holiday.name}:`, error);
      }
    }

    // Seed events
    console.log("Seeding events...");
    for (const event of sampleEvents) {
      try {
        await eventService.createEvent(event, "admin");
        console.log(`Created event: ${event.title}`);
      } catch (error) {
        console.error(`Error creating event ${event.title}:`, error);
      }
    }

    // Create some sample attendance records for today
    console.log("Creating sample attendance records...");
    const employees = await employeeService.getAll();
    const today = new Date();

    if (employees.length > 0) {
      for (let i = 0; i < Math.min(3, employees.length); i++) {
        const employee = employees[i];
        const statuses = ["present", "late", "sick_leave"];
        const status = statuses[i] as any;

        try {
          await attendanceService.createOrUpdate({
            employeeId: employee.id,
            date: today,
            status,
            checkInTime:
              status !== "sick_leave"
                ? new Date(today.getTime() + (9 + i) * 60 * 60 * 1000)
                : undefined,
            workingHours: status === "present" ? 8 : undefined,
            markedBy: "admin",
            notes: status === "sick_leave" ? "Flu symptoms" : undefined,
          });
          console.log(
            `Created attendance record for ${employee.name}: ${status}`
          );
        } catch (error) {
          console.error(
            `Error creating attendance for ${employee.name}:`,
            error
          );
        }
      }
    }

    console.log("Database seeding completed successfully!");
    return { success: true, message: "Database seeded successfully" };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, message: "Failed to seed database", error };
  }
}
