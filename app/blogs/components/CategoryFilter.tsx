"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  viewMode,
  onViewModeChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700 mr-2">
          Filter by:
        </span>
        <Badge
          onClick={() => onSelectCategory("All")}
          className={`cursor-pointer transition-all ${
            selectedCategory === "All"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}>
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`cursor-pointer transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}>
            {category}
          </Badge>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1">
        <Button
          size="sm"
          variant={viewMode === "grid" ? "default" : "ghost"}
          onClick={() => onViewModeChange("grid")}
          className="h-8 w-8 p-0">
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={viewMode === "list" ? "default" : "ghost"}
          onClick={() => onViewModeChange("list")}
          className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
