"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PRICE_RANGES } from "@/lib/shop-constants";
import { X } from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  inStockOnly: boolean;
  rating: number;
  brands: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBrands: string[];
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableBrands,
}: FilterSidebarProps) {
  const handlePriceChange = (values: number[]) => {
    onFilterChange({ ...filters, priceRange: [values[0], values[1]] });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleReset = () => {
    onFilterChange({
      priceRange: [0, 10000],
      inStockOnly: false,
      rating: 0,
      brands: [],
    });
  };

  const hasActiveFilters =
    filters.inStockOnly ||
    filters.rating > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-amber-600 hover:text-amber-700">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Price Range</Label>
          <div className="px-2">
            <Slider
              min={0}
              max={10000}
              step={100}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}+</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Availability</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, inStockOnly: checked as boolean })
              }
            />
            <label
              htmlFor="inStock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
              In Stock Only
            </label>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Minimum Rating</Label>
          <div className="space-y-2">
            {[4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) =>
                    onFilterChange({ ...filters, rating: checked ? rating : 0 })
                  }
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                  {rating}★ & above
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Brands</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
