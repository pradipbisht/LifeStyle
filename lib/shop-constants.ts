// Shop constants and category mappings

import { Category } from "./types/shop";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "health", label: "Health & Lifestyle", emoji: "💪" },
  { value: "skincare", label: "Skincare", emoji: "✨" },
  { value: "haircare", label: "Haircare", emoji: "💇" },
  { value: "pets", label: "Pet Care", emoji: "🐾" },
  { value: "parenting", label: "Baby & Kids", emoji: "👶" },
];

export const SUBCATEGORIES: Record<Category, string[]> = {
  health: ["Fitness", "Diet & Nutrition", "Mindfulness", "Self-Improvement"],
  skincare: ["Acne Care", "Glowing Skin", "Anti-Aging", "Daily Routines"],
  haircare: [
    "Hair Growth",
    "Styling Tips",
    "Hairfall Solutions",
    "DIY Hair Masks",
  ],
  pets: ["Dogs", "Cats", "Nutrition", "Training", "Grooming"],
  parenting: [
    "Baby Nutrition",
    "Baby Skincare",
    "Sleep Training",
    "New Parent Guide",
  ],
};

export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: Infinity },
];
