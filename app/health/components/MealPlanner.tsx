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
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Meal {
  id: number;
  name: string;
  time: string;
}

export default function MealPlanner() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [meals, setMeals] = useState<Record<string, Meal[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [newMealName, setNewMealName] = useState("");
  const [newMealTime, setNewMealTime] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const addMeal = () => {
    if (!newMealName || !newMealTime) return;

    const newMeal: Meal = {
      id: Date.now(),
      name: newMealName,
      time: newMealTime,
    };

    setMeals((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newMeal],
    }));

    setNewMealName("");
    setNewMealTime("");
  };

  const deleteMeal = (mealId: number) => {
    setMeals((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((m) => m.id !== mealId),
    }));
  };

  const quickAddMeal = (mealType: string) => {
    const newMeal: Meal = {
      id: Date.now(),
      name: mealType,
      time: "",
    };

    setMeals((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newMeal],
    }));
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center shadow-md">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Meal Planner</CardTitle>
            <CardDescription>
              Plan your weekly meals and track nutrition
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Day Selector */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Select Day</Label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(day)}
                className={
                  selectedDay === day ? "bg-green-600 hover:bg-green-700" : ""
                }>
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Add Meal Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick Add</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {mealTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => quickAddMeal(type)}
                className="border-2 border-dashed hover:border-solid hover:bg-green-50">
                <Plus className="h-4 w-4 mr-1" />
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Custom Meal */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <Label className="text-sm font-medium">Add Custom Meal</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="mealName" className="text-xs text-gray-600">
                Meal Name
              </Label>
              <Input
                id="mealName"
                placeholder="e.g., Grilled Chicken Salad"
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mealTime" className="text-xs text-gray-600">
                Time (Optional)
              </Label>
              <Input
                id="mealTime"
                type="time"
                value={newMealTime}
                onChange={(e) => setNewMealTime(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={addMeal}
            disabled={!newMealName}
            className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        </div>

        {/* Meal List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">
              {selectedDay}'s Meals ({meals[selectedDay]?.length || 0})
            </Label>
            {meals[selectedDay]?.length > 0 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200">
                {meals[selectedDay].length} meal
                {meals[selectedDay].length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {meals[selectedDay]?.length > 0 ? (
              meals[selectedDay].map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-3 bg-white border-2 border-gray-100 rounded-lg hover:border-green-200 transition-colors group">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{meal.name}</p>
                    {meal.time && (
                      <p className="text-sm text-gray-500">{meal.time}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMeal(meal.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No meals planned for {selectedDay}</p>
                <p className="text-xs mt-1">
                  Use quick add or add a custom meal
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
