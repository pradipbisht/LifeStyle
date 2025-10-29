"use client";

import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/shop-constants";
import { Category } from "@/lib/types/shop";

interface CategoryTabsProps {
  activeCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="border-b bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => onCategoryChange("all")}
            className={
              activeCategory === "all" ? "bg-amber-600 hover:bg-amber-700" : ""
            }>
            All Products
          </Button>

          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              onClick={() => onCategoryChange(cat.value)}
              className={
                activeCategory === cat.value
                  ? "bg-amber-600 hover:bg-amber-700"
                  : ""
              }>
              {cat.emoji} {cat.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
