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
import { Search, Dog, Cat } from "lucide-react";

export default function PetFoodFinder() {
  const [step, setStep] = useState(1);
  const [petType, setPetType] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);

  const ages = ["Puppy/Kitten", "Adult", "Senior"];
  const sizes = ["Small", "Medium", "Large", "Giant"];
  const healthConcerns = [
    "Weight Control",
    "Sensitive Stomach",
    "Joint Health",
    "Skin & Coat",
    "Dental Health",
  ];

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const generateRecommendations = () => {
    setRecommendations({
      primary: {
        name: "Premium Adult Dog Food",
        brand: "PetNutrition Pro",
        price: "$45/bag",
        rating: "4.8/5",
      },
      alternative: {
        name: "Natural Balance Formula",
        brand: "HealthyPaws",
        price: "$38/bag",
        rating: "4.6/5",
      },
    });
    setStep(5);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-amber-600 flex items-center justify-center shadow-md">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Pet Food Finder</CardTitle>
            <CardDescription>
              Find the perfect nutrition for your pet
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Pet Type */}
        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              What type of pet do you have?
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={petType === "dog" ? "default" : "outline"}
                onClick={() => setPetType("dog")}
                className={`h-24 flex flex-col gap-2 ${
                  petType === "dog"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "hover:border-amber-400"
                }`}>
                <Dog className="h-8 w-8" />
                <span>Dog</span>
              </Button>
              <Button
                variant={petType === "cat" ? "default" : "outline"}
                onClick={() => setPetType("cat")}
                className={`h-24 flex flex-col gap-2 ${
                  petType === "cat"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "hover:border-amber-400"
                }`}>
                <Cat className="h-8 w-8" />
                <span>Cat</span>
              </Button>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!petType}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              Next Step
            </Button>
          </div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              What's your pet's age?
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {ages.map((ageGroup) => (
                <Button
                  key={ageGroup}
                  variant={age === ageGroup ? "default" : "outline"}
                  onClick={() => setAge(ageGroup)}
                  className={
                    age === ageGroup
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "hover:border-amber-400"
                  }>
                  {ageGroup}
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!age}
                className="flex-1 bg-amber-600 hover:bg-amber-700">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Size */}
        {step === 3 && petType === "dog" && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              What's your dog's size?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {sizes.map((sizeOption) => (
                <Button
                  key={sizeOption}
                  variant={size === sizeOption ? "default" : "outline"}
                  onClick={() => setSize(sizeOption)}
                  className={
                    size === sizeOption
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "hover:border-amber-400"
                  }>
                  {sizeOption}
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!size}
                className="flex-1 bg-amber-600 hover:bg-amber-700">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Health Concerns */}
        {(step === 4 || (step === 3 && petType === "cat")) && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              Any health concerns? (Optional)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {healthConcerns.map((concern) => (
                <Button
                  key={concern}
                  variant={concerns.includes(concern) ? "default" : "outline"}
                  onClick={() => toggleConcern(concern)}
                  className={
                    concerns.includes(concern)
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "hover:border-amber-400"
                  }>
                  {concern}
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(petType === "dog" ? 3 : 2)}
                variant="outline"
                className="flex-1">
                Back
              </Button>
              <Button
                onClick={generateRecommendations}
                className="flex-1 bg-amber-600 hover:bg-amber-700">
                Get Recommendations
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === 5 && recommendations && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Perfect Food Matches
              </h3>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                {petType === "dog" ? "🐕" : "🐱"} {age} • {size || "Cat"}
              </Badge>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <Badge className="mb-2 bg-amber-600 text-white">Top Pick</Badge>
                <h4 className="font-bold text-gray-900 text-lg">
                  {recommendations.primary.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {recommendations.primary.brand}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 font-semibold">
                    {recommendations.primary.price}
                  </span>
                  <span className="text-sm">
                    ⭐ {recommendations.primary.rating}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Badge className="mb-2 bg-gray-600 text-white">
                  Alternative
                </Badge>
                <h4 className="font-bold text-gray-900">
                  {recommendations.alternative.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {recommendations.alternative.brand}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 font-semibold">
                    {recommendations.alternative.price}
                  </span>
                  <span className="text-sm">
                    ⭐ {recommendations.alternative.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStep(1);
                  setRecommendations(null);
                  setConcerns([]);
                }}
                variant="outline"
                className="flex-1">
                Start Over
              </Button>
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                Save Results
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
