"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
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

export default function CategoryIntegrations() {
  const categories: Category[] = [
    {
      name: "Health & Fitness",
      icon: <Dumbbell className="h-6 w-6 text-white" />,
      description: "Fitness tips, diet plans & wellness guides.",
      href: "/health-lifestyle",
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "Lifestyle",
      icon: <Heart className="h-6 w-6 text-white" />,
      description: "Self-improvement & daily habit tips.",
      href: "/health-lifestyle",
      color: "from-rose-500 to-pink-600",
    },
    {
      name: "Skincare",
      icon: <Sparkles className="h-6 w-6 text-white" />,
      description: "Expert routines & product guides.",
      href: "/skincare",
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      name: "Haircare",
      icon: <Scissors className="h-6 w-6 text-white" />,
      description: "Hair health tips & styling guides.",
      href: "/haircare",
      color: "from-amber-500 to-orange-600",
    },
    {
      name: "Pets",
      icon: <PawPrint className="h-6 w-6 text-white" />,
      description: "Pet care tips & expert advice.",
      href: "/pets",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Parenting",
      icon: <Baby className="h-6 w-6 text-white" />,
      description: "Newborn care & parenting guides.",
      href: "/parenting",
      color: "from-teal-500 to-emerald-600",
    },
  ];

  return (
    <section>
      <div className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Explore Our Lifestyle Categories
            </h2>
            <p className="text-muted-foreground mt-6">
              Discover expert tips and curated guides across wellness, beauty,
              and family life.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                title={cat.name}
                description={cat.description}
                href={cat.href}
                color={cat.color}>
                {cat.icon}
              </CategoryCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CategoryCard = ({
  title,
  description,
  children,
  href,
  color,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  href: string;
  color: string;
}) => {
  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        {/* Icon Container */}
        <div
          className={`inline-flex items-center justify-center rounded-xl bg-linear-to-br ${color} text-white p-3 shadow-md mb-4`}>
          {children}
        </div>

        {/* Title + Description */}
        <div className="space-y-2 pb-6">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        {/* Learn More Button */}
        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="gap-1 pr-2 shadow-none">
            <Link href={href}>
              Explore
              <ChevronRight className="ml-1 size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
