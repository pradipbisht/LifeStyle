"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export default function TestFirebasePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    setLogs([]);

    try {
      addLog("Testing Firebase connection...");

      // Test 1: Create a simple test document
      addLog("Creating test document...");
      const testDoc = await addDoc(collection(db, "test"), {
        message: "Hello Firebase!",
        timestamp: Timestamp.now(),
      });
      addLog(`✅ Test document created with ID: ${testDoc.id}`);

      // Test 2: Read the test document
      addLog("Reading test documents...");
      const querySnapshot = await getDocs(collection(db, "test"));
      addLog(`✅ Found ${querySnapshot.size} test documents`);

      // Test 3: Try to create an employee
      addLog("Creating test employee...");
      const employeeDoc = await addDoc(collection(db, "employees"), {
        name: "Test Employee",
        email: "test@example.com",
        department: "Testing",
        position: "Test Position",
        employeeId: "TEST001",
        joinDate: Timestamp.fromDate(new Date()),
        isActive: true,
        createdAt: Timestamp.now(),
      });
      addLog(`✅ Employee created with ID: ${employeeDoc.id}`);

      // Test 4: Try to create an event
      addLog("Creating test event...");
      const eventDoc = await addDoc(collection(db, "events"), {
        title: "Test Event",
        description: "This is a test event",
        category: "wellness",
        type: "single",
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(new Date()),
        startTime: "10:00",
        endTime: "11:00",
        location: {
          type: "physical",
          address: "Test Address",
          city: "Test City",
          country: "Test Country",
        },
        capacity: 10,
        price: 0,
        currency: "USD",
        status: "published",
        featured: false,
        tags: ["test"],
        registered: 0,
        attended: 0,
        createdBy: "admin",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      addLog(`✅ Event created with ID: ${eventDoc.id}`);

      // Test 5: Try to create attendance record
      addLog("Creating test attendance...");
      const attendanceDoc = await addDoc(collection(db, "attendance"), {
        employeeId: employeeDoc.id,
        date: Timestamp.fromDate(new Date()),
        status: "present",
        checkInTime: Timestamp.now(),
        workingHours: 8,
        markedBy: "admin",
        createdAt: Timestamp.now(),
      });
      addLog(`✅ Attendance record created with ID: ${attendanceDoc.id}`);

      addLog("🎉 All tests passed! Firebase is working correctly.");
    } catch (error) {
      addLog(`❌ Error: ${error}`);
      console.error("Firebase test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Firebase Connection Test
        </h1>
        <p className="text-muted-foreground">
          Test Firebase connectivity and create sample documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firebase Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testFirebaseConnection} disabled={loading}>
              {loading ? "Testing..." : "Test Firebase Connection"}
            </Button>
            <Button variant="outline" onClick={clearLogs}>
              Clear Logs
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">
                Click 'Test Firebase Connection' to start testing...
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
