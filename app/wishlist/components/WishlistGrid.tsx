"use client";

import { WishlistItem } from "@/app/types/wishlist";
import WishlistCard from "./WishlistCard";

interface WishlistGridProps {
  items: WishlistItem[];
  loading?: boolean;
}

export default function WishlistGrid({ items, loading }: WishlistGridProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} />
      ))}
    </div>
  );
}
