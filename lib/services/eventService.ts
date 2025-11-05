import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  Event,
  CreateEventData,
  EventRegistration,
  EventAttendance,
  EventFilters,
  EventAnalytics,
} from "@/types/event";

export class EventService {
  private eventsCollection = "events";
  private registrationsCollection = "event_registrations";
  private attendanceCollection = "event_attendance";

  // Event CRUD operations
  async createEvent(
    eventData: CreateEventData,
    adminId: string
  ): Promise<string> {
    try {
      const newEvent = {
        ...eventData,
        registered: 0,
        attended: 0,
        createdBy: adminId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        startDate: Timestamp.fromDate(eventData.startDate),
        endDate: Timestamp.fromDate(eventData.endDate),
      };

      const docRef = await addDoc(
        collection(db, this.eventsCollection),
        newEvent
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Failed to create event");
    }
  }

  async updateEvent(
    eventId: string,
    eventData: Partial<CreateEventData>
  ): Promise<void> {
    try {
      const updateData = {
        ...eventData,
        updatedAt: Timestamp.now(),
        ...(eventData.startDate && {
          startDate: Timestamp.fromDate(eventData.startDate),
        }),
        ...(eventData.endDate && {
          endDate: Timestamp.fromDate(eventData.endDate),
        }),
      };

      await updateDoc(doc(db, this.eventsCollection, eventId), updateData);
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error("Failed to update event");
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete event
      batch.delete(doc(db, this.eventsCollection, eventId));

      // Delete all registrations for this event
      const registrationsQuery = query(
        collection(db, this.registrationsCollection),
        where("eventId", "==", eventId)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);
      registrationsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete all attendance records for this event
      const attendanceQuery = query(
        collection(db, this.attendanceCollection),
        where("eventId", "==", eventId)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      attendanceSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error("Failed to delete event");
    }
  }

  async getEvent(eventId: string): Promise<Event | null> {
    try {
      const docSnap = await getDoc(doc(db, this.eventsCollection, eventId));

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Event;
      }

      return null;
    } catch (error) {
      console.error("Error getting event:", error);
      throw new Error("Failed to get event");
    }
  }

  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      let q = query(
        collection(db, this.eventsCollection),
        orderBy("startDate", "desc")
      );

      if (filters?.status) {
        q = query(q, where("status", "==", filters.status));
      }

      if (filters?.category) {
        q = query(q, where("category", "==", filters.category));
      }

      if (filters?.featured !== undefined) {
        q = query(q, where("featured", "==", filters.featured));
      }

      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Event;
      });

      // Apply client-side filters
      let filteredEvents = events;

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters?.dateRange) {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.startDate >= filters.dateRange!.from &&
            event.startDate <= filters.dateRange!.to
        );
      }

      if (filters?.location) {
        filteredEvents = filteredEvents.filter(
          (event) => event.location.type === filters.location
        );
      }

      return filteredEvents;
    } catch (error) {
      console.error("Error getting events:", error);
      throw new Error("Failed to get events");
    }
  }

  // Registration operations
  async registerForEvent(
    eventId: string,
    userId: string,
    userDetails: {
      userName: string;
      userEmail: string;
      phone?: string;
    }
  ): Promise<string> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      if (event.registered >= event.capacity) {
        throw new Error("Event is full");
      }

      // Check if user is already registered
      const existingRegistration = await this.getUserRegistration(
        eventId,
        userId
      );
      if (
        existingRegistration &&
        existingRegistration.status === "registered"
      ) {
        throw new Error("User already registered for this event");
      }

      const batch = writeBatch(db);

      // Create registration
      const registrationData = {
        eventId,
        userId,
        ...userDetails,
        registeredAt: Timestamp.now(),
        status: "registered" as const,
        paymentStatus:
          event.price > 0 ? ("pending" as const) : ("paid" as const),
      };

      const registrationRef = doc(collection(db, this.registrationsCollection));
      batch.set(registrationRef, registrationData);

      // Update event registered count
      const eventRef = doc(db, this.eventsCollection, eventId);
      batch.update(eventRef, {
        registered: event.registered + 1,
        updatedAt: Timestamp.now(),
      });

      await batch.commit();
      return registrationRef.id;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  }

  async cancelRegistration(registrationId: string): Promise<void> {
    try {
      const registrationDoc = await getDoc(
        doc(db, this.registrationsCollection, registrationId)
      );

      if (!registrationDoc.exists()) {
        throw new Error("Registration not found");
      }

      const registration = registrationDoc.data() as EventRegistration;
      const event = await this.getEvent(registration.eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      const batch = writeBatch(db);

      // Update registration status
      batch.update(registrationDoc.ref, {
        status: "cancelled",
        updatedAt: Timestamp.now(),
      });

      // Update event registered count
      batch.update(doc(db, this.eventsCollection, registration.eventId), {
        registered: Math.max(0, event.registered - 1),
        updatedAt: Timestamp.now(),
      });

      await batch.commit();
    } catch (error) {
      console.error("Error cancelling registration:", error);
      throw error;
    }
  }

  async getUserRegistration(
    eventId: string,
    userId: string
  ): Promise<EventRegistration | null> {
    try {
      const q = query(
        collection(db, this.registrationsCollection),
        where("eventId", "==", eventId),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        registeredAt: data.registeredAt.toDate(),
        ...(data.attendanceMarkedAt && {
          attendanceMarkedAt: data.attendanceMarkedAt.toDate(),
        }),
      } as EventRegistration;
    } catch (error) {
      console.error("Error getting user registration:", error);
      throw new Error("Failed to get user registration");
    }
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      const q = query(
        collection(db, this.registrationsCollection),
        where("eventId", "==", eventId),
        orderBy("registeredAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          registeredAt: data.registeredAt.toDate(),
          ...(data.attendanceMarkedAt && {
            attendanceMarkedAt: data.attendanceMarkedAt.toDate(),
          }),
        } as EventRegistration;
      });
    } catch (error) {
      console.error("Error getting event registrations:", error);
      throw new Error("Failed to get event registrations");
    }
  }

  // Attendance operations
  async markAttendance(
    registrationId: string,
    status: "present" | "absent" | "late" | "left-early",
    adminId: string,
    notes?: string
  ): Promise<void> {
    try {
      const registrationDoc = await getDoc(
        doc(db, this.registrationsCollection, registrationId)
      );

      if (!registrationDoc.exists()) {
        throw new Error("Registration not found");
      }

      const registration = registrationDoc.data() as EventRegistration;
      const event = await this.getEvent(registration.eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      const batch = writeBatch(db);

      // Create or update attendance record
      const attendanceData = {
        eventId: registration.eventId,
        registrationId,
        userId: registration.userId,
        attendanceStatus: status,
        markedBy: adminId,
        notes,
        createdAt: Timestamp.now(),
        ...(status === "present" || status === "late"
          ? { checkInTime: Timestamp.now() }
          : {}),
      };

      const attendanceRef = doc(collection(db, this.attendanceCollection));
      batch.set(attendanceRef, attendanceData);

      // Update registration status
      const newRegistrationStatus =
        status === "present" || status === "late" ? "attended" : "no-show";
      batch.update(registrationDoc.ref, {
        status: newRegistrationStatus,
        attendanceMarkedAt: Timestamp.now(),
        attendanceMarkedBy: adminId,
      });

      // Update event attendance count if marking as present
      if (status === "present" || status === "late") {
        batch.update(doc(db, this.eventsCollection, registration.eventId), {
          attended: event.attended + 1,
          updatedAt: Timestamp.now(),
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  }

  async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    try {
      const q = query(
        collection(db, this.attendanceCollection),
        where("eventId", "==", eventId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          ...(data.checkInTime && { checkInTime: data.checkInTime.toDate() }),
          ...(data.checkOutTime && {
            checkOutTime: data.checkOutTime.toDate(),
          }),
        } as EventAttendance;
      });
    } catch (error) {
      console.error("Error getting event attendance:", error);
      throw new Error("Failed to get event attendance");
    }
  }

  // Analytics
  async getEventAnalytics(): Promise<EventAnalytics> {
    try {
      const events = await this.getEvents();
      const allRegistrations = await this.getAllRegistrations();
      const allAttendance = await this.getAllAttendance();

      const totalEvents = events.length;
      const publishedEvents = events.filter(
        (e) => e.status === "published"
      ).length;
      const completedEvents = events.filter(
        (e) => e.status === "completed"
      ).length;
      const totalRegistrations = allRegistrations.length;
      const totalAttendance = allAttendance.length;
      const attendanceRate =
        totalRegistrations > 0
          ? (totalAttendance / totalRegistrations) * 100
          : 0;

      // Category breakdown
      const categoryBreakdown = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Monthly stats (last 12 months)
      const monthlyStats = this.generateMonthlyStats(
        events,
        allRegistrations,
        allAttendance
      );

      return {
        totalEvents,
        publishedEvents,
        completedEvents,
        totalRegistrations,
        totalAttendance,
        attendanceRate,
        categoryBreakdown: categoryBreakdown as any,
        monthlyStats,
      };
    } catch (error) {
      console.error("Error getting event analytics:", error);
      throw new Error("Failed to get event analytics");
    }
  }

  private async getAllRegistrations(): Promise<EventRegistration[]> {
    const querySnapshot = await getDocs(
      collection(db, this.registrationsCollection)
    );
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        registeredAt: data.registeredAt.toDate(),
      } as EventRegistration;
    });
  }

  private async getAllAttendance(): Promise<EventAttendance[]> {
    const querySnapshot = await getDocs(
      collection(db, this.attendanceCollection)
    );
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as EventAttendance;
    });
  }

  private generateMonthlyStats(
    events: Event[],
    registrations: EventRegistration[],
    attendance: EventAttendance[]
  ) {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        events: 0,
        registrations: 0,
        attendance: 0,
      };
    }).reverse();

    // Count events by month
    events.forEach((event) => {
      const monthKey = event.startDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const monthData = last12Months.find((m) => m.month === monthKey);
      if (monthData) {
        monthData.events++;
      }
    });

    // Count registrations by month
    registrations.forEach((reg) => {
      const monthKey = reg.registeredAt.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const monthData = last12Months.find((m) => m.month === monthKey);
      if (monthData) {
        monthData.registrations++;
      }
    });

    // Count attendance by month
    attendance.forEach((att) => {
      const monthKey = att.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const monthData = last12Months.find((m) => m.month === monthKey);
      if (monthData) {
        monthData.attendance++;
      }
    });

    return last12Months;
  }
}

export const eventService = new EventService();
