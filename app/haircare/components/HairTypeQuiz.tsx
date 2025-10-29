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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Scissors } from "lucide-react";

export default function HairTypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    {
      question: "How does your hair feel after washing (without products)?",
      options: [
        { value: "dry", label: "Dry and rough" },
        { value: "normal", label: "Soft and smooth" },
        { value: "oily", label: "Greasy within hours" },
        { value: "mixed", label: "Oily roots, dry ends" },
      ],
    },
    {
      question: "What's your hair's natural texture?",
      options: [
        { value: "straight", label: "Straight" },
        { value: "wavy", label: "Wavy" },
        { value: "curly", label: "Curly" },
        { value: "coily", label: "Coily/Kinky" },
      ],
    },
    {
      question: "How thick is your hair strand?",
      options: [
        { value: "fine", label: "Fine (hard to feel)" },
        { value: "medium", label: "Medium (visible thread)" },
        { value: "thick", label: "Thick (strong strand)" },
      ],
    },
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: string[]) => {
    const moisture = finalAnswers[0];
    const texture = finalAnswers[1];
    const thickness = finalAnswers[2];

    let hairType = "";

    if (moisture === "dry") {
      hairType = thickness === "fine" ? "Fine Dry Hair" : "Thick Dry Hair";
    } else if (moisture === "oily") {
      hairType = "Oily Hair";
    } else if (moisture === "mixed") {
      hairType = "Combination Hair";
    } else {
      hairType = "Normal Hair";
    }

    setResult(
      `${hairType} • ${texture.charAt(0).toUpperCase() + texture.slice(1)}`
    );
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const getResultColor = () => {
    if (result?.includes("Dry"))
      return "bg-orange-100 text-orange-700 border-orange-200";
    if (result?.includes("Oily"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (result?.includes("Combination"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-md">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Hair Type Quiz</CardTitle>
            <CardDescription>
              Discover your unique hair characteristics
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!result ? (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                {questions[currentQuestion].question}
              </Label>
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer font-medium">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Back Button */}
            {currentQuestion > 0 && (
              <Button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                variant="outline"
                className="w-full">
                Back
              </Button>
            )}
          </>
        ) : (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Your Hair Type
              </h3>
              <Badge className={`text-lg px-4 py-2 ${getResultColor()}`}>
                {result}
              </Badge>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-gray-900 mb-3">
                Care Recommendations:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li>✓ Use sulfate-free shampoo</li>
                <li>✓ Deep condition weekly</li>
                <li>✓ Avoid heat styling when possible</li>
                <li>✓ Trim every 6-8 weeks</li>
              </ul>
            </div>

            <Button
              onClick={resetQuiz}
              variant="outline"
              className="w-full border-purple-400 text-purple-600 hover:bg-purple-50">
              Take Quiz Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
