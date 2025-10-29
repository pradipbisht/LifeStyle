"use client";

import { Dog, Cat, Apple, GraduationCap, Scissors } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import PetsHero from "./components/PetsHero";
import CategoryCard from "./components/CategoryCard";
import PetFoodFinder from "./components/PetFoodFinder";
import NutritionCalculator from "./components/NutritionCalculator";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function PetsPage() {
  const categories = [
    {
      title: "Dogs",
      icon: Dog,
      description: "Complete care guide for your canine companion",
      color: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-600",
      href: "/pets/dogs",
    },
    {
      title: "Cats",
      icon: Cat,
      description: "Everything you need to know about cat care",
      color: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-600",
      href: "/pets/cats",
    },
    {
      title: "Nutrition",
      icon: Apple,
      description: "Healthy diet plans for your pets",
      color: "from-green-50 to-emerald-50",
      iconBg: "bg-green-600",
      href: "/pets/nutrition",
    },
    {
      title: "Training",
      icon: GraduationCap,
      description: "Effective training techniques and tips",
      color: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-600",
      href: "/pets/training",
    },
    {
      title: "Grooming",
      icon: Scissors,
      description: "Keep your pet looking and feeling great",
      color: "from-pink-50 to-rose-50",
      iconBg: "bg-pink-600",
      href: "/pets/grooming",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <PetsHero />

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Pet Care Topics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive guides for happy, healthy pets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
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

      {/* Interactive Pet Tools */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
              Smart Pet Care Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect food and calculate nutritional needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <PetFoodFinder />
            <NutritionCalculator />
          </div>
        </div>
      </section>
    </main>
  );
}
