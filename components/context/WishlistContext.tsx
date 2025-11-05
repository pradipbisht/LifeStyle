"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { WishlistContextType } from "@/app/types/wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlistData = useWishlist();

  const contextValue: WishlistContextType = {
    wishlistItems: wishlistData.wishlistItems,
    wishlistCount: wishlistData.wishlistCount,
    loading: wishlistData.loading,
    addToWishlist: wishlistData.addToWishlist,
    removeFromWishlist: wishlistData.removeFromWishlist,
    removeByProductId: wishlistData.removeByProductId,
    isInWishlist: wishlistData.isInWishlist,
    clearWishlist: wishlistData.clearWishlist,
    refreshWishlist: wishlistData.refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error(
      "useWishlistContext must be used within a WishlistProvider"
    );
  }
  return context;
}
