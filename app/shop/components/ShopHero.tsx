"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

interface ShopHeroProps {
  onSearch?: (query: string) => void;
}

export default function ShopHero({ onSearch }: ShopHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-amber-50 via-white to-orange-50 py-16 md:py-20">
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 bg-amber-100 text-amber-700 border-amber-200 text-base px-4 py-1.5">
          🛍️ Wellness Marketplace
        </Badge>

        <h1
          className={`${playfair.className} text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight`}>
          Curated Products for{" "}
          <span className="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Your Lifestyle
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Discover expert-approved products for health, beauty, pets, and
          parenting
        </p>

        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-12 pr-4 py-6 text-lg border-amber-200 focus:border-amber-400"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
