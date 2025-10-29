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
import { Sparkles, Loader2, ShoppingBag } from "lucide-react";

export default function ProductRecommender() {
  const [step, setStep] = useState(1);
  const [hairType, setHairType] = useState("");
  const [concern, setConcern] = useState("");
  const [budget, setBudget] = useState("");
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const hairTypes = ["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick"];
  const concerns = [
    "Dryness",
    "Frizz",
    "Hair Fall",
    "Damage",
    "Dullness",
    "Split Ends",
  ];
  const budgets = ["Budget ($)", "Mid-Range ($$)", "Premium ($$$)"];

  const generateRecommendations = () => {
    setLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      setRecommendations({
        shampoo: {
          name: "Moisture Balance Shampoo",
          price: "$18",
          rating: "4.5/5",
        },
        conditioner: {
          name: "Deep Repair Conditioner",
          price: "$22",
          rating: "4.7/5",
        },
        treatment: { name: "Weekly Hair Mask", price: "$28", rating: "4.8/5" },
        styling: {
          name: "Leave-in Conditioner",
          price: "$15",
          rating: "4.6/5",
        },
      });
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Product Recommender</CardTitle>
            <CardDescription>
              Find the perfect products for your hair
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Hair Type */}
        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              Select Your Hair Type
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hairTypes.map((type) => (
                <Button
                  key={type}
                  variant={hairType === type ? "default" : "outline"}
                  onClick={() => setHairType(type)}
                  className={
                    hairType === type
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "hover:border-purple-400"
                  }>
                  {type}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!hairType}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Next Step
            </Button>
          </div>
        )}

        {/* Step 2: Concern */}
        {step === 2 && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              Main Hair Concern
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {concerns.map((item) => (
                <Button
                  key={item}
                  variant={concern === item ? "default" : "outline"}
                  onClick={() => setConcern(item)}
                  className={
                    concern === item
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "hover:border-purple-400"
                  }>
                  {item}
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
                disabled={!concern}
                className="flex-1 bg-purple-600 hover:bg-purple-700">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-4">
            <Label className="text-base font-semibold mb-3 block">
              Select Your Budget Range
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {budgets.map((item) => (
                <Button
                  key={item}
                  variant={budget === item ? "default" : "outline"}
                  onClick={() => setBudget(item)}
                  className={
                    budget === item
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "hover:border-purple-400"
                  }>
                  {item}
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
                disabled={loading}>
                Back
              </Button>
              <Button
                onClick={generateRecommendations}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!budget || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Products...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && recommendations && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Your Perfect Hair Care Routine
              </h3>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                {hairType} Hair • {concern} • {budget}
              </Badge>
            </div>

            {/* Product Recommendations */}
            <div className="space-y-4">
              {Object.entries(recommendations).map(
                ([category, product]: [string, any]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                        {category}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ⭐ {product.rating}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        {product.price}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs border-purple-400 text-purple-600 hover:bg-purple-50">
                        View
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStep(1);
                  setRecommendations(null);
                }}
                variant="outline"
                className="flex-1">
                Start Over
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Save Recommendations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
