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
import { Sparkles, Loader2, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateSkincareRoutine } from "@/lib/gemini";

export default function RoutineBuilder() {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];
  const skinConcerns = [
    "Acne",
    "Dark Spots",
    "Fine Lines",
    "Dryness",
    "Dullness",
    "Large Pores",
  ];

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const getFallbackRoutine = () => ({
    morning: [
      { step: "Cleanser", product: "Gentle Foaming Cleanser" },
      { step: "Toner", product: "Hydrating Toner" },
      { step: "Serum", product: "Vitamin C Serum" },
      { step: "Moisturizer", product: "Lightweight Day Cream" },
      { step: "Sunscreen", product: "SPF 50 Sunscreen" },
    ],
    evening: [
      { step: "Cleanser", product: "Oil-Based Cleanser" },
      { step: "Exfoliant", product: "AHA/BHA Exfoliant (2x week)" },
      { step: "Serum", product: "Retinol Serum" },
      { step: "Moisturizer", product: "Night Cream" },
    ],
  });

  const generateAIRoutine = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await generateSkincareRoutine(
        skinType,
        concerns,
        age ? parseInt(age) : undefined
      );

      if (result.success && result.text) {
        // Parse JSON from AI response
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiRoutine = JSON.parse(jsonMatch[0]);
          setRoutine(aiRoutine);
        } else {
          setRoutine(getFallbackRoutine());
        }
      } else {
        setRoutine(getFallbackRoutine());
      }
    } catch (err) {
      console.error("AI generation error:", err);
      setError("Using fallback routine. AI temporarily unavailable.");
      setRoutine(getFallbackRoutine());
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center shadow-md">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">AI Routine Builder</CardTitle>
            <CardDescription>
              Get personalized recommendations powered by AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Skin Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Select Your Skin Type
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skinTypes.map((type) => (
                  <Button
                    key={type}
                    variant={skinType === type ? "default" : "outline"}
                    onClick={() => setSkinType(type)}
                    className={
                      skinType === type
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "hover:border-pink-400"
                    }>
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!skinType}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Next Step
            </Button>
          </div>
        )}

        {/* Step 2: Concerns */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Select Your Skin Concerns (Optional)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skinConcerns.map((concern) => (
                  <Button
                    key={concern}
                    variant={concerns.includes(concern) ? "default" : "outline"}
                    onClick={() => toggleConcern(concern)}
                    className={
                      concerns.includes(concern)
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "hover:border-pink-400"
                    }>
                    {concern}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="age"
                className="text-base font-semibold mb-2 block">
                Age (Optional - helps AI personalize)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-pink-200 focus:border-pink-400"
              />
            </div>

            {error && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
                disabled={loading}>
                Back
              </Button>
              <Button
                onClick={generateAIRoutine}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
                disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate AI Routine
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && routine && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Your Custom Routine
              </h3>
              <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                {skinType} Skin
                {concerns.length > 0 && ` • ${concerns.join(", ")}`}
              </Badge>
            </div>

            {/* Morning Routine */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">☀️</span> Morning Routine
              </h4>
              <div className="space-y-2">
                {routine.morning.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.step}</p>
                      <p className="text-sm text-gray-600">{item.product}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening Routine */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🌙</span> Evening Routine
              </h4>
              <div className="space-y-2">
                {routine.evening.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="shrink-0 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.step}</p>
                      <p className="text-sm text-gray-600">{item.product}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStep(1);
                  setRoutine(null);
                }}
                variant="outline"
                className="flex-1">
                Start Over
              </Button>
              <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                Save Routine
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
