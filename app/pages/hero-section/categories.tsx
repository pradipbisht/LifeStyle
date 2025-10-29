"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Dumbbell,
  Heart,
  Sparkles,
  Scissors,
  PawPrint,
  Baby,
} from "lucide-react";

interface Category {
  name: string;
  icon: React.ReactNode;
  description: string;
  href: string;
  color: string;
}

export default function CategoryGrid() {
  const categories: Category[] = [
    {
      name: "Health & Fitness",
      icon: <Dumbbell className="h-8 w-8 md:h-10 md:w-10" />,
      description: "Fitness tips, diet plans & wellness guides",
      href: "/health-lifestyle",
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "Lifestyle",
      icon: <Heart className="h-8 w-8 md:h-10 md:w-10" />,
      description: "Self-improvement & daily habits",
      href: "/health-lifestyle",
      color: "from-rose-500 to-pink-600",
    },
    {
      name: "Skincare",
      icon: <Sparkles className="h-8 w-8 md:h-10 md:w-10" />,
      description: "Expert routines & product guides",
      href: "/skincare",
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      name: "Haircare",
      icon: <Scissors className="h-8 w-8 md:h-10 md:w-10" />,
      description: "Hair health tips & styling guides",
      href: "/haircare",
      color: "from-amber-500 to-orange-600",
    },
    {
      name: "Pets",
      icon: <PawPrint className="h-8 w-8 md:h-10 md:w-10" />,
      description: "Pet care tips & expert advice",
      href: "/pets",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Parenting",
      icon: <Baby className="h-8 w-8 md:h-10 md:w-10" />,
      description: "Newborn care & parenting guides",
      href: "/parenting",
      color: "from-teal-500 to-emerald-600",
    },
  ];

  return (
    <div className="mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Explore Our Categories
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Everything you need for a healthier, happier lifestyle
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link
            href={category.href}
            key={category.name}
            aria-label={category.name}
            className="group">
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-40 group-hover:scale-105 group-hover:-translate-y-2">
              <div className="p-6 flex items-start gap-4 relative z-10">
                <div
                  className={`p-4 rounded-2xl bg-linear-to-br ${category.color} text-white shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
