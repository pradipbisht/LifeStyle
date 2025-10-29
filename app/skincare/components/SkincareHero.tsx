"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function SkincareHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-pink-50 via-white to-rose-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-6 bg-pink-100 text-pink-700 border-pink-200 px-4 py-1 text-sm">
            💆‍♀️ Skincare Hub
          </Badge>

          <h1
            className={`${playfair.className} text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight`}>
            Your Path to{" "}
            <span className="bg-linear-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              Radiant Skin
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Dermat-approved articles, product guides, and personalized routines
            for glowing, healthy skin
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg">
              Find Your Perfect Routine ✨
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-50" />
    </section>
  );
}
