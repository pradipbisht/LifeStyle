"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function DirectSeedPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const seedDirectly = async () => {
    setLoading(true);
    setLogs([]);

    try {
      addLog("Starting direct database seeding...");

      // Create employees directly
      addLog("Creating employees...");
      const employees = [
        {
          name: "John Smith",
          email: "john.smith@company.com",
          phone: "+1-555-0123",
          department: "Engineering",
          position: "Senior Developer",
          employeeId: "EMP001",
          joinDate: Timestamp.fromDate(new Date(2023, 0, 15)),
          isActive: true,
          createdAt: Timestamp.now(),
        },
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          phone: "+1-555-0456",
          department: "Marketing",
          position: "Marketing Manager",
          employeeId: "EMP002",
          joinDate: Timestamp.fromDate(new Date(2023, 2, 10)),
          isActive: true,
          createdAt: Timestamp.now(),
        },
      ];

      const employeeIds = [];
      for (const employee of employees) {
        const docRef = await addDoc(collection(db, "employees"), employee);
        employeeIds.push(docRef.id);
        addLog(`✅ Created employee: ${employee.name} (ID: ${docRef.id})`);
      }

      // Create events directly
      addLog("Creating events...");
      const events = [
        {
          title: "Wellness Workshop",
          description:
            "A comprehensive workshop focusing on mental and physical wellness in the workplace.",
          category: "wellness",
          type: "single",
          startDate: Timestamp.fromDate(new Date(2025, 0, 15)),
          endDate: Timestamp.fromDate(new Date(2025, 0, 15)),
          startTime: "10:00",
          endTime: "12:00",
          location: {
            type: "physical",
            address: "123 Wellness Center",
            city: "New York",
            country: "USA",
          },
          capacity: 30,
          price: 0,
          currency: "USD",
          status: "published",
          featured: true,
          tags: ["wellness", "mental-health", "workshop"],
          registered: 0,
          attended: 0,
          createdBy: "admin",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          title: "Skincare Masterclass",
          description:
            "Learn the fundamentals of skincare routines and product selection.",
          category: "skincare",
          type: "single",
          startDate: Timestamp.fromDate(new Date(2025, 0, 18)),
          endDate: Timestamp.fromDate(new Date(2025, 0, 18)),
          startTime: "14:00",
          endTime: "16:00",
          location: {
            type: "online",
            url: "https://zoom.us/meeting",
          },
          capacity: 20,
          price: 25,
          currency: "USD",
          status: "published",
          featured: false,
          tags: ["skincare", "beauty", "masterclass"],
          registered: 0,
          attended: 0,
          createdBy: "admin",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
      ];

      for (const event of events) {
        const docRef = await addDoc(collection(db, "events"), event);
        addLog(`✅ Created event: ${event.title} (ID: ${docRef.id})`);
      }

      // Create attendance records directly
      addLog("Creating attendance records...");
      const today = new Date();
      for (let i = 0; i < employeeIds.length; i++) {
        const attendanceRecord = {
          employeeId: employeeIds[i],
          date: Timestamp.fromDate(today),
          status: i === 0 ? "present" : "late",
          checkInTime: Timestamp.fromDate(
            new Date(today.getTime() + (9 + i) * 60 * 60 * 1000)
          ),
          workingHours: 8,
          markedBy: "admin",
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(
          collection(db, "attendance"),
          attendanceRecord
        );
        addLog(
          `✅ Created attendance record for employee ${employeeIds[i]} (ID: ${docRef.id})`
        );
      }

      // Create holidays directly
      addLog("Creating holidays...");
      const holidays = [
        {
          name: "New Year's Day",
          date: Timestamp.fromDate(new Date(2025, 0, 1)),
          type: "national",
          isRecurring: true,
          createdAt: Timestamp.now(),
        },
        {
          name: "Christmas Day",
          date: Timestamp.fromDate(new Date(2025, 11, 25)),
          type: "national",
          isRecurring: true,
          createdAt: Timestamp.now(),
        },
      ];

      for (const holiday of holidays) {
        const docRef = await addDoc(collection(db, "holidays"), holiday);
        addLog(`✅ Created holiday: ${holiday.name} (ID: ${docRef.id})`);
      }

      addLog("🎉 Direct seeding completed successfully!");
    } catch (error) {
      addLog(`❌ Error during seeding: ${error}`);
      console.error("Direct seeding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Direct Database Seeding
        </h1>
        <p className="text-muted-foreground">
          Directly create documents in Firebase collections
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Direct Seed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={seedDirectly} disabled={loading}>
            {loading ? "Seeding..." : "Seed Database Directly"}
          </Button>

          <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">
                Click 'Seed Database Directly' to start...
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
