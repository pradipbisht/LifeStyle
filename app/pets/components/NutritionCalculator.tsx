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
import { Calculator } from "lucide-react";

export default function NutritionCalculator() {
  const [petType, setPetType] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [result, setResult] = useState<any>(null);

  const activityLevels = ["Low", "Moderate", "High"];

  const calculateNutrition = () => {
    const weightNum = parseFloat(weight);
    let calories = 0;

    if (petType === "dog") {
      const rer = 70 * Math.pow(weightNum, 0.75);
      const multiplier =
        activityLevel === "Low"
          ? 1.2
          : activityLevel === "Moderate"
          ? 1.6
          : 2.0;
      calories = Math.round(rer * multiplier);
    } else {
      calories = Math.round(
        weightNum *
          (activityLevel === "Low"
            ? 20
            : activityLevel === "Moderate"
            ? 30
            : 40)
      );
    }

    setResult({
      calories,
      protein: Math.round((calories * 0.25) / 4),
      fat: Math.round((calories * 0.15) / 9),
      carbs: Math.round((calories * 0.6) / 4),
      water: Math.round(weightNum * 50),
    });
  };

  const resetCalculator = () => {
    setPetType("");
    setWeight("");
    setActivityLevel("");
    setResult(null);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center shadow-md">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Nutrition Calculator</CardTitle>
            <CardDescription>
              Calculate daily nutritional needs for your pet
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!result ? (
          <>
            {/* Pet Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Pet Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={petType === "dog" ? "default" : "outline"}
                  onClick={() => setPetType("dog")}
                  className={
                    petType === "dog"
                      ? "bg-green-600 hover:bg-green-700"
                      : "hover:border-green-400"
                  }>
                  🐕 Dog
                </Button>
                <Button
                  variant={petType === "cat" ? "default" : "outline"}
                  onClick={() => setPetType("cat")}
                  className={
                    petType === "cat"
                      ? "bg-green-600 hover:bg-green-700"
                      : "hover:border-green-400"
                  }>
                  🐱 Cat
                </Button>
              </div>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-base font-semibold">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter pet's weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Activity Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {activityLevels.map((level) => (
                  <Button
                    key={level}
                    variant={activityLevel === level ? "default" : "outline"}
                    onClick={() => setActivityLevel(level)}
                    className={
                      activityLevel === level
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:border-green-400"
                    }>
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={calculateNutrition}
              disabled={!petType || !weight || !activityLevel}
              className="w-full bg-green-600 hover:bg-green-700 text-white">
              Calculate Nutrition
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Daily Nutritional Needs
              </h3>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {petType === "dog" ? "🐕" : "🐱"} {weight}kg • {activityLevel}{" "}
                Activity
              </Badge>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-semibold mb-1">
                  Daily Calories
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.calories} kcal
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Protein</p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.protein}g
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Fat</p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.fat}g
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Carbs</p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.carbs}g
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Water</p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.water}ml
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                💡 Tips:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Split meals into 2-3 portions daily</li>
                <li>• Adjust for treats (max 10% of calories)</li>
                <li>• Always provide fresh water</li>
                <li>• Consult vet for specific health needs</li>
              </ul>
            </div>

            <Button
              onClick={resetCalculator}
              variant="outline"
              className="w-full border-green-400 text-green-600 hover:bg-green-50">
              Calculate Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
