"use client";

import { Heart, Apple, Brain, TrendingUp } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import HealthHero from "./components/HealthHero";
import SubsectionCard from "./components/SubsectionCard";
import BMICalculator from "./components/BMICalculator";
import MealPlanner from "./components/MealPlanner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function HealthPage() {
  const subsections = [
    {
      title: "Fitness",
      icon: Heart,
      description:
        "Workout routines, exercise tips, and fitness motivation to keep you active",
      color: "from-red-50 to-pink-50",
      iconBg: "bg-red-600",
      href: "/health/fitness",
    },
    {
      title: "Diet",
      icon: Apple,
      description:
        "Healthy eating plans, nutrition guides, and delicious recipes",
      color: "from-green-50 to-emerald-50",
      iconBg: "bg-green-600",
      href: "/health/diet",
    },
    {
      title: "Mindfulness",
      icon: Brain,
      description:
        "Meditation techniques, stress relief, and mental wellness practices",
      color: "from-purple-50 to-indigo-50",
      iconBg: "bg-purple-600",
      href: "/health/mindfulness",
    },
    {
      title: "Self-Improvement",
      icon: TrendingUp,
      description:
        "Personal growth strategies, productivity hacks, and success tips",
      color: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-600",
      href: "/health/self-improvement",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HealthHero />

      {/* Subsections - Fitness, Diet, Mindfulness, Self-Improvement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Explore Health Topics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your focus area and start your wellness journey today
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subsections.map((section) => (
              <SubsectionCard
                key={section.title}
                title={section.title}
                description={section.description}
                icon={section.icon}
                color={section.color}
                iconBg={section.iconBg}
                href={section.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section
        id="tools"
        className="py-16 bg-linear-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Interactive Health Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use our free tools to track your health metrics and plan your
              meals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <BMICalculator />
            <MealPlanner />
          </div>
        </div>
      </section>
    </main>
  );
}
