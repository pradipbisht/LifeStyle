"use client";

import { Sparkles, Scissors, AlertCircle, Beaker } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import HaircareHero from "./components/HaircareHero";
import SubsectionCard from "./components/SubsectionCard";
import HairTypeQuiz from "./components/HairTypeQuiz";
import ProductRecommender from "./components/ProductRecommender";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function HaircarePage() {
  const subsections = [
    {
      title: "Hair Growth",
      icon: Sparkles,
      description: "Natural remedies for stronger, longer hair",
      color: "from-emerald-50 to-green-50",
      iconBg: "bg-emerald-600",
      href: "/haircare/hair-growth",
    },
    {
      title: "Styling Tips",
      icon: Scissors,
      description: "Professional styling techniques at home",
      color: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-600",
      href: "/haircare/styling-tips",
    },
    {
      title: "Hairfall Solutions",
      icon: AlertCircle,
      description: "Effective treatments for hair loss",
      color: "from-orange-50 to-amber-50",
      iconBg: "bg-orange-600",
      href: "/haircare/hairfall-solutions",
    },
    {
      title: "DIY Hair Masks",
      icon: Beaker,
      description: "Homemade treatments for healthy hair",
      color: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-600",
      href: "/haircare/diy-hair-masks",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HaircareHero />

      {/* Subsections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Haircare Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert solutions for every hair concern and goal
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

      {/* Interactive Hair Tools */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Personalized Hair Care
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your hair type and get custom product recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <HairTypeQuiz />
            <ProductRecommender />
          </div>
        </div>
      </section>
    </main>
  );
}
