"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export default function FirebaseTestPage() {
  const testFirebaseConnection = async () => {
    try {
      console.log("Testing Firebase connection...");

      // Test 1: Try to read from employees collection
      console.log("Testing read access...");
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      console.log("Employees found:", employeesSnapshot.size);

      // Test 2: Try to create a test employee
      console.log("Testing write access...");
      const testEmployeeData = {
        name: "Firebase Test Employee",
        email: "test@firebase.com",
        department: "Testing",
        position: "Test Employee",
        employeeId: "FIREBASE_TEST",
        joinDate: Timestamp.fromDate(new Date()),
        isActive: true,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, "employees"),
        testEmployeeData
      );
      console.log("Test employee created with ID:", docRef.id);

      alert("Firebase connection test successful!");
    } catch (error) {
      console.error("Firebase connection test failed:", error);
      alert(`Firebase test failed: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testFirebaseConnection}>
            Test Firebase Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
