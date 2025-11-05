import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  type Employee,
  type AttendanceRecord,
  type Holiday,
} from "@/types/attendance";

// Collections
const EMPLOYEES_COLLECTION = "employees";
const ATTENDANCE_COLLECTION = "attendance";
const HOLIDAYS_COLLECTION = "holidays";

// Employee Services
export const employeeService = {
  // Get all employees
  async getAll(): Promise<Employee[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, EMPLOYEES_COLLECTION), orderBy("name", "asc"))
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        joinDate: doc.data().joinDate?.toDate?.() || new Date(),
      })) as Employee[];
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  },

  // Get employee by ID
  async getById(id: string): Promise<Employee | null> {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          joinDate: docSnap.data().joinDate?.toDate?.() || new Date(),
        } as Employee;
      }
      return null;
    } catch (error) {
      console.error("Error fetching employee:", error);
      return null;
    }
  },

  // Create new employee
  async create(employee: Omit<Employee, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), {
        ...employee,
        joinDate: Timestamp.fromDate(employee.joinDate),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  // Update employee
  async update(id: string, employee: Partial<Employee>): Promise<void> {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, id);
      const updateData: any = { ...employee };
      if (employee.joinDate) {
        updateData.joinDate = Timestamp.fromDate(employee.joinDate);
      }
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  // Delete employee
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  // Listen to employees changes
  onSnapshot(callback: (employees: Employee[]) => void) {
    return onSnapshot(
      query(collection(db, EMPLOYEES_COLLECTION), orderBy("name", "asc")),
      (snapshot) => {
        const employees = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          joinDate: doc.data().joinDate?.toDate?.() || new Date(),
        })) as Employee[];
        callback(employees);
      },
      (error) => {
        console.error("Error listening to employees:", error);
      }
    );
  },
};

// Attendance Services
export const attendanceService = {
  // Get attendance records for a date range
  async getByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceRecord[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, ATTENDANCE_COLLECTION),
          where("date", ">=", Timestamp.fromDate(startDate)),
          where("date", "<=", Timestamp.fromDate(endDate)),
          orderBy("date", "desc")
        )
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(),
        checkInTime: doc.data().checkInTime?.toDate?.(),
        checkOutTime: doc.data().checkOutTime?.toDate?.(),
        markedAt: doc.data().markedAt?.toDate?.() || new Date(),
      })) as AttendanceRecord[];
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      return [];
    }
  },

  // Get attendance for specific employee and date
  async getByEmployeeAndDate(
    employeeId: string,
    date: Date
  ): Promise<AttendanceRecord | null> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const querySnapshot = await getDocs(
        query(
          collection(db, ATTENDANCE_COLLECTION),
          where("employeeId", "==", employeeId),
          where("date", ">=", Timestamp.fromDate(startOfDay)),
          where("date", "<=", Timestamp.fromDate(endOfDay))
        )
      );

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || new Date(),
          checkInTime: doc.data().checkInTime?.toDate?.(),
          checkOutTime: doc.data().checkOutTime?.toDate?.(),
          markedAt: doc.data().markedAt?.toDate?.() || new Date(),
        } as AttendanceRecord;
      }
      return null;
    } catch (error) {
      console.error("Error fetching attendance record:", error);
      return null;
    }
  },

  // Create or update attendance record
  async createOrUpdate(
    attendance: Omit<AttendanceRecord, "id" | "markedAt">
  ): Promise<string> {
    try {
      // Check if record exists for this employee and date
      const existing = await this.getByEmployeeAndDate(
        attendance.employeeId,
        attendance.date
      );

      const attendanceData = {
        ...attendance,
        date: Timestamp.fromDate(attendance.date),
        checkInTime: attendance.checkInTime
          ? Timestamp.fromDate(attendance.checkInTime)
          : null,
        checkOutTime: attendance.checkOutTime
          ? Timestamp.fromDate(attendance.checkOutTime)
          : null,
        markedAt: serverTimestamp(),
      };

      if (existing) {
        // Update existing record
        const docRef = doc(db, ATTENDANCE_COLLECTION, existing.id);
        await updateDoc(docRef, attendanceData);
        return existing.id;
      } else {
        // Create new record
        const docRef = await addDoc(
          collection(db, ATTENDANCE_COLLECTION),
          attendanceData
        );
        return docRef.id;
      }
    } catch (error) {
      console.error("Error creating/updating attendance:", error);
      throw error;
    }
  },

  // Delete attendance record
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, ATTENDANCE_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      throw error;
    }
  },

  // Listen to attendance changes
  onSnapshot(callback: (attendance: AttendanceRecord[]) => void) {
    return onSnapshot(
      query(collection(db, ATTENDANCE_COLLECTION), orderBy("date", "desc")),
      (snapshot) => {
        const attendance = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || new Date(),
          checkInTime: doc.data().checkInTime?.toDate?.(),
          checkOutTime: doc.data().checkOutTime?.toDate?.(),
          markedAt: doc.data().markedAt?.toDate?.() || new Date(),
        })) as AttendanceRecord[];
        callback(attendance);
      },
      (error) => {
        console.error("Error listening to attendance:", error);
      }
    );
  },
};

// Holiday Services
export const holidayService = {
  // Get all holidays
  async getAll(): Promise<Holiday[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, HOLIDAYS_COLLECTION), orderBy("date", "asc"))
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(),
      })) as Holiday[];
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  },

  // Create holiday
  async create(holiday: Omit<Holiday, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, HOLIDAYS_COLLECTION), {
        ...holiday,
        date: Timestamp.fromDate(holiday.date),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating holiday:", error);
      throw error;
    }
  },

  // Update holiday
  async update(id: string, holiday: Partial<Holiday>): Promise<void> {
    try {
      const docRef = doc(db, HOLIDAYS_COLLECTION, id);
      const updateData: any = { ...holiday };
      if (holiday.date) {
        updateData.date = Timestamp.fromDate(holiday.date);
      }
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating holiday:", error);
      throw error;
    }
  },

  // Delete holiday
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, HOLIDAYS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting holiday:", error);
      throw error;
    }
  },
};
