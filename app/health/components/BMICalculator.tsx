"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));

      // Determine category
      if (calculatedBMI < 18.5) {
        setCategory("Underweight");
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setCategory("Healthy Weight");
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setCategory("Overweight");
      } else {
        setCategory("Obese");
      }
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "Underweight":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Healthy Weight":
        return "bg-green-100 text-green-700 border-green-200";
      case "Overweight":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Obese":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">BMI Calculator</CardTitle>
            <CardDescription>Calculate your Body Mass Index</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-lg"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-3">
          <Button
            onClick={calculateBMI}
            disabled={!height || !weight}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Calculate BMI
          </Button>

          {bmi !== null && (
            <Button
              onClick={resetCalculator}
              variant="outline"
              className="border-2">
              Reset
            </Button>
          )}
        </div>

        {/* Result Display */}
        {bmi !== null && (
          <div className="mt-6 p-6 bg-linear-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
            <div className="text-center space-y-4">
              <p className="text-sm font-medium text-gray-600">Your BMI is</p>

              <div className="text-6xl font-bold text-gray-900">{bmi}</div>

              <Badge
                className={`${getCategoryColor()} px-4 py-2 text-base font-semibold`}>
                {category}
              </Badge>

              {/* BMI Reference Chart */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-3">
                  BMI Categories
                </p>
                <div className="space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Underweight</span>
                    <span className="font-medium text-gray-700">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Healthy Weight</span>
                    <span className="font-medium text-gray-700">
                      18.5 - 24.9
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overweight</span>
                    <span className="font-medium text-gray-700">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Obese</span>
                    <span className="font-medium text-gray-700">≥ 30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
