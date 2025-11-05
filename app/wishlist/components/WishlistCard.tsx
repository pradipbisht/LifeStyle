"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Trash2,
  ExternalLink,
  ShoppingCart,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { WishlistItem } from "@/app/types/wishlist";
import { useWishlistContext } from "@/components/context/WishlistContext";

interface WishlistCardProps {
  item: WishlistItem;
}

export default function WishlistCard({ item }: WishlistCardProps) {
  const { removeFromWishlist } = useWishlistContext();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromWishlist(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setRemoving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-20 h-20 shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg";
              }}
            />
            <Badge
              variant={item.productType === "product" ? "default" : "secondary"}
              className="absolute -top-2 -right-2 text-xs">
              {item.productType === "product" ? "Product" : "Blog"}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {item.category}
                  </Badge>

                  {item.author && (
                    <Badge variant="outline" className="text-xs">
                      by {item.author}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Added {formatDate(item.addedAt)}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col items-end gap-2 ml-4">
                {item.price && (
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ${item.price.toFixed(2)}
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-1">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={item.url}>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>

                  {item.productType === "product" && (
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRemove}
                    disabled={removing}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Heart className="w-3 h-3 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
