"use client";

import { Sparkles, Sun, Clock, Droplets } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import SkincareHero from "./components/SkincareHero";
import SubsectionCard from "./components/SubsectionCard";
import SkinTypeQuiz from "./components/SkinTypeQuiz";
import RoutineBuilder from "./components/RoutineBuilder";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function SkincarePage() {
  const subsections = [
    {
      title: "Acne Care",
      icon: Droplets,
      description:
        "Solutions for clear, blemish-free skin with proven treatments",
      color: "from-rose-50 to-pink-50",
      iconBg: "bg-rose-600",
      href: "/skincare/acne-care",
    },
    {
      title: "Glowing Skin",
      icon: Sparkles,
      description: "Achieve radiant, luminous complexion naturally",
      color: "from-yellow-50 to-amber-50",
      iconBg: "bg-yellow-600",
      href: "/skincare/glowing-skin",
    },
    {
      title: "Anti-Aging",
      icon: Clock,
      description: "Youthful skin at any age with expert care",
      color: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-600",
      href: "/skincare/anti-aging",
    },
    {
      title: "Daily Routines",
      icon: Sun,
      description: "Morning & evening skincare rituals for best results",
      color: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-600",
      href: "/skincare/daily-routines",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkincareHero />

      {/* Subsections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Skincare Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your skin concern and discover expert-approved solutions
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

      {/* Interactive Tools with AI */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              AI-Powered Skincare Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalized recommendations powered by artificial
              intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <SkinTypeQuiz />
            <RoutineBuilder />
          </div>
        </div>
      </section>
    </main>
  );
}
