"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function ParentingHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-24">
      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 text-base px-4 py-1.5">
          👶 Parenting Hub
        </Badge>

        <h1
          className={`${playfair.className} text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight`}>
          Your Partner in{" "}
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Raising Happy Kids
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Expert advice on baby care, nutrition, development, and parenting tips
          for every stage
        </p>

        <Button
          size="lg"
          className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6">
          <Baby className="mr-2 h-5 w-5" />
          Track Baby's Growth
        </Button>
      </div>
    </section>
  );
}
