"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function PetsHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-amber-50 via-white to-orange-50 py-20 md:py-24">
      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 bg-amber-100 text-amber-700 border-amber-200 text-base px-4 py-1.5">
          🐾 Pet Care Hub
        </Badge>

        <h1
          className={`${playfair.className} text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight`}>
          Everything for Your{" "}
          <span className="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Furry Friends
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Expert advice on nutrition, training, grooming, and health for dogs
          and cats
        </p>

        <Button
          size="lg"
          className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6">
          <Heart className="mr-2 h-5 w-5" />
          Find Perfect Pet Food
        </Button>
      </div>
    </section>
  );
}
