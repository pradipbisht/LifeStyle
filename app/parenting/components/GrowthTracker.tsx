"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GrowthTracker() {
  const [babyAge, setBabyAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateGrowth = () => {
    const ageMonths = parseInt(babyAge);
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    // Simple percentile calculation (simplified for demo)
    const weightPercentile = weightKg > 8 ? 75 : weightKg > 6 ? 50 : 25;
    const heightPercentile = heightCm > 70 ? 75 : heightCm > 65 ? 50 : 25;

    setResult({
      ageMonths,
      weightPercentile,
      heightPercentile,
      status:
        weightPercentile >= 50 && heightPercentile >= 50
          ? "On Track"
          : "Monitor",
    });
  };

  const resetTracker = () => {
    setBabyAge("");
    setWeight("");
    setHeight("");
    setGender("");
    setResult(null);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Growth Tracker</CardTitle>
            <CardDescription>
              Monitor your baby's development milestones
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!result ? (
          <>
            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Baby's Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boy">Boy</SelectItem>
                  <SelectItem value="girl">Girl</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-base font-semibold">
                Age (months)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age in months"
                value={babyAge}
                onChange={(e) => setBabyAge(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-base font-semibold">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base font-semibold">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="Enter height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <Button
              onClick={calculateGrowth}
              disabled={!babyAge || !weight || !height || !gender}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Calculate Growth
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Growth Analysis
              </h3>
              <Badge
                className={
                  result.status === "On Track"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                }>
                {result.status}
              </Badge>
            </div>

            {/* Growth Metrics */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold mb-1">Age</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.ageMonths} months
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    Weight Percentile
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.weightPercentile}th
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    Height Percentile
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.heightPercentile}th
                  </p>
                </div>
              </div>
            </div>

            {/* Growth Chart Reference */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                📊 Percentile Guide:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 75th+ : Above average growth</li>
                <li>• 50th : Average (healthy)</li>
                <li>• 25th : Below average (monitor)</li>
                <li>• Consult pediatrician if concerned</li>
              </ul>
            </div>

            <Button
              onClick={resetTracker}
              variant="outline"
              className="w-full border-blue-400 text-blue-600 hover:bg-blue-50">
              Track New Measurement
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
