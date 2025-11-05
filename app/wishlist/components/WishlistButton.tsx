"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useWishlistContext } from "@/components/context/WishlistContext";
import { useAuth } from "@/components/context/AuthContext";
import { WishlistItem } from "@/app/types/wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  item: Omit<WishlistItem, "id" | "userId" | "addedAt">;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function WishlistButton({
  item,
  variant = "outline",
  size = "md",
  showText = false,
  className,
}: WishlistButtonProps) {
  const { user } = useAuth();
  const { addToWishlist, isInWishlist, removeByProductId } =
    useWishlistContext();
  const [loading, setLoading] = useState(false);

  const inWishlist = isInWishlist(item.productId, item.productType);

  const handleToggle = async () => {
    if (!user) {
      // Could show login modal here
      alert("Please sign in to add items to your wishlist");
      return;
    }

    try {
      setLoading(true);

      if (inWishlist) {
        await removeByProductId(item.productId, item.productType);
      } else {
        await addToWishlist(item);
      }
    } catch (error: any) {
      alert(error.message || "Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      default:
        return "h-10 w-10";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-4 h-4";
    }
  };

  if (showText) {
    return (
      <Button
        variant={variant}
        onClick={handleToggle}
        disabled={loading}
        className={cn("gap-2", className)}>
        {loading ? (
          <Loader2 className={cn(getIconSize(), "animate-spin")} />
        ) : (
          <Heart
            className={cn(
              getIconSize(),
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
            )}
          />
        )}
        {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      className={cn(getButtonSize(), className)}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
      {loading ? (
        <Loader2 className={cn(getIconSize(), "animate-spin")} />
      ) : (
        <Heart
          className={cn(
            getIconSize(),
            inWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400"
          )}
        />
      )}
    </Button>
  );
}
