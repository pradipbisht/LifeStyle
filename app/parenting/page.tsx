"use client";

import { Baby, Sparkles, Moon, BookOpen } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import ParentingHero from "./components/ParentingHero";
import ResourceCard from "./components/ResourceCard";
import GrowthTracker from "./components/GrowthTracker";
import MilestoneChecker from "./components/MilestoneChecker";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function ParentingPage() {
  const categories = [
    {
      title: "Baby Nutrition",
      icon: Baby,
      description: "Healthy feeding schedules and recipes",
      color: "from-green-50 to-emerald-50",
      iconBg: "bg-green-600",
      href: "/parenting/baby-nutrition",
    },
    {
      title: "Baby Skincare",
      icon: Sparkles,
      description: "Gentle products for delicate skin",
      color: "from-pink-50 to-rose-50",
      iconBg: "bg-pink-600",
      href: "/parenting/baby-skincare",
    },
    {
      title: "Sleep Training",
      icon: Moon,
      description: "Establish healthy sleep routines",
      color: "from-indigo-50 to-blue-50",
      iconBg: "bg-indigo-600",
      href: "/parenting/sleep-training",
    },
    {
      title: "New Parent Guide",
      icon: BookOpen,
      description: "Essential tips for first-time parents",
      color: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-600",
      href: "/parenting/new-parent-guide",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <ParentingHero />

      {/* Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Parenting Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Essential guides for every stage of your parenting journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <ResourceCard
                key={category.title}
                title={category.title}
                description={category.description}
                icon={category.icon}
                color={category.color}
                iconBg={category.iconBg}
                href={category.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Parenting Tools */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Baby Development Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track growth milestones and developmental progress
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <GrowthTracker />
            <MilestoneChecker />
          </div>
        </div>
      </section>
    </main>
  );
}
