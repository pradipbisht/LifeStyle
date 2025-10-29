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
import { FileText, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SkinTypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    {
      question: "How does your skin feel a few hours after cleansing?",
      options: [
        "Tight and dry",
        "Comfortable",
        "Shiny in T-zone",
        "Oily all over",
      ],
    },
    {
      question: "How often do you experience breakouts?",
      options: [
        "Rarely",
        "Occasionally",
        "Frequently in T-zone",
        "Very frequently",
      ],
    },
    {
      question: "How would you describe your pores?",
      options: [
        "Barely visible",
        "Small to medium",
        "Visible in T-zone",
        "Large and visible",
      ],
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const skinTypes = ["Dry", "Normal", "Combination", "Oily"];
      const counts = newAnswers.reduce((acc, ans, idx) => {
        const optionIndex = questions[idx].options.indexOf(ans);
        acc[optionIndex] = (acc[optionIndex] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const maxCount = Math.max(...Object.values(counts));
      const resultIndex = Object.keys(counts).find(
        (key) => counts[parseInt(key)] === maxCount
      );
      setResult(skinTypes[parseInt(resultIndex || "1")]);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-pink-600 flex items-center justify-center shadow-md">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Skin Type Quiz</CardTitle>
            <CardDescription>
              Find your perfect skincare routine
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!result ? (
          <>
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-pink-600 to-rose-600 transition-all duration-300"
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
              <h3 className="text-lg font-semibold text-gray-900">
                {questions[currentQuestion].question}
              </h3>

              <RadioGroup className="space-y-3">
                {questions[currentQuestion].options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-pink-400 hover:bg-pink-50 cursor-pointer transition-all group">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex-1 cursor-pointer text-gray-700 group-hover:text-gray-900">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        ) : (
          /* Result */
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Skin Type:
              </h3>
              <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-6 py-2 text-xl font-bold">
                {result}
              </Badge>
            </div>

            <div className="p-6 bg-linear-to-br from-pink-50 to-rose-50 rounded-xl">
              <p className="text-gray-700 mb-4">
                Based on your answers, we've identified your skin type as{" "}
                <strong>{result}</strong>. Here are personalized
                recommendations:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>✓ Use gentle, hydrating cleansers</li>
                <li>✓ Apply lightweight moisturizer daily</li>
                <li>✓ Always use SPF 30+ sunscreen</li>
                <li>✓ Consider adding a serum to your routine</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Retake Quiz
              </Button>
              <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                Get Full Routine
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
