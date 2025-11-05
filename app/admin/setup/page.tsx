"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { seedDatabase } from "@/lib/utils/seedDatabase";
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react";

export default function DatabaseSetupPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const seedResult = await seedDatabase();
      setResult(seedResult);
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to seed database: " + (error as Error).message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Setup</h1>
        <p className="text-muted-foreground">
          Initialize your database with sample data for testing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Database
          </CardTitle>
          <CardDescription>
            This will populate your Firebase database with sample employees,
            events, holidays, and attendance records. This action is safe to run
            multiple times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Sample data includes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 5 sample employees with different departments</li>
              <li>• 4 holidays (national and company holidays)</li>
              <li>
                • 4 sample events (wellness, skincare, fitness, nutrition)
              </li>
              <li>• Today's attendance records for 3 employees</li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="min-w-32">
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
          </div>

          {result && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                result.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{result.message}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            After seeding the database, you can:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Visit the <strong>Attendance</strong> page to see employee
              attendance tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Check the <strong>Events</strong> page to manage wellness events
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Add more employees, events, and attendance records as needed
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
