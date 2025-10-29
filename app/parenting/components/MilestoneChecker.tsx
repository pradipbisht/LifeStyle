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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MilestoneChecker() {
  const [selectedAge, setSelectedAge] = useState("");
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([]);

  const milestonesByAge: Record<string, string[]> = {
    "3": [
      "Lifts head when on tummy",
      "Opens and closes hands",
      "Brings hands to mouth",
      "Smiles at people",
    ],
    "6": [
      "Rolls over",
      "Begins to sit without support",
      "Responds to own name",
      "Makes vowel sounds",
    ],
    "9": [
      "Sits without support",
      "Reaches for toys",
      "Says 'mama' and 'dada'",
      "Plays peek-a-boo",
    ],
    "12": [
      "Stands alone",
      "Takes first steps",
      "Says 2-3 words",
      "Waves bye-bye",
    ],
    "18": [
      "Walks independently",
      "Says 10-20 words",
      "Uses spoon/fork",
      "Points to show things",
    ],
    "24": [
      "Runs",
      "Kicks a ball",
      "Says 50+ words",
      "Follows 2-step instructions",
    ],
  };

  const toggleMilestone = (milestone: string) => {
    setCheckedMilestones((prev) =>
      prev.includes(milestone)
        ? prev.filter((m) => m !== milestone)
        : [...prev, milestone]
    );
  };

  const currentMilestones = selectedAge
    ? milestonesByAge[selectedAge] || []
    : [];
  const completionRate =
    currentMilestones.length > 0
      ? Math.round((checkedMilestones.length / currentMilestones.length) * 100)
      : 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Milestone Checker</CardTitle>
            <CardDescription>
              Track your baby's developmental progress
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Age Selection */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Baby's Age (months)</Label>
          <Select
            value={selectedAge}
            onValueChange={(value) => {
              setSelectedAge(value);
              setCheckedMilestones([]);
            }}>
            <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="9">9 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="18">18 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Milestones List */}
        {selectedAge && (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Milestones Achieved</span>
                <span>{completionRate}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Milestone Checklist */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Expected Milestones for {selectedAge} Months
              </Label>
              {currentMilestones.map((milestone) => {
                const isChecked = checkedMilestones.includes(milestone);
                return (
                  <div
                    key={milestone}
                    onClick={() => toggleMilestone(milestone)}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isChecked
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}>
                    <div className="shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <p
                      className={`flex-1 ${
                        isChecked
                          ? "text-gray-900 font-medium"
                          : "text-gray-700"
                      }`}>
                      {milestone}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Results */}
            {checkedMilestones.length > 0 && (
              <div className="space-y-3">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <Badge className="mb-2 bg-indigo-600 text-white">
                    {checkedMilestones.length} / {currentMilestones.length}{" "}
                    Achieved
                  </Badge>
                  <p className="text-sm text-gray-700 mt-2">
                    {completionRate >= 75
                      ? "✨ Great progress! Your baby is developing well."
                      : completionRate >= 50
                      ? "👍 Good development! Keep encouraging activities."
                      : "💡 Every baby develops at their own pace. Consult your pediatrician if concerned."}
                  </p>
                </div>

                <Button
                  onClick={() => setCheckedMilestones([])}
                  variant="outline"
                  className="w-full border-indigo-400 text-indigo-600 hover:bg-indigo-50">
                  Reset Checklist
                </Button>
              </div>
            )}
          </>
        )}

        {/* Information */}
        {!selectedAge && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Select your baby's age to see expected developmental milestones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
