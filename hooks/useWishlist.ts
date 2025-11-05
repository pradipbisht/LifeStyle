"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/components/context/AuthContext";
import { WishlistItem } from "@/app/types/wishlist";

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Simple query without orderBy to avoid index requirement
      const wishlistQuery = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(wishlistQuery);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        addedAt: doc.data().addedAt?.toDate() || new Date(),
      })) as WishlistItem[];

      // Sort in JavaScript instead of Firestore
      const sortedItems = items.sort(
        (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
      );

      setWishlistItems(sortedItems);
      setError(null);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }; // Add item to wishlist
  const addToWishlist = async (
    item: Omit<WishlistItem, "id" | "userId" | "addedAt">
  ) => {
    if (!user) {
      throw new Error("You must be logged in to add items to wishlist");
    }

    try {
      // Check if item already exists
      const existingItem = wishlistItems.find(
        (wishItem) =>
          wishItem.productId === item.productId &&
          wishItem.productType === item.productType
      );

      if (existingItem) {
        throw new Error("Item is already in your wishlist");
      }

      const docRef = await addDoc(collection(db, "wishlist"), {
        ...item,
        userId: user.uid,
        addedAt: serverTimestamp(),
      });

      const newItem: WishlistItem = {
        id: docRef.id,
        ...item,
        userId: user.uid,
        addedAt: new Date(),
      };

      setWishlistItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      throw new Error(error.message || "Failed to add item to wishlist");
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (itemId: string) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    try {
      await deleteDoc(doc(db, "wishlist", itemId));
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw new Error("Failed to remove item from wishlist");
    }
  };

  // Remove by product ID (useful for wishlist buttons)
  const removeByProductId = async (
    productId: string,
    productType: "product" | "blog" = "product"
  ) => {
    if (!user) return;

    const item = wishlistItems.find(
      (item) => item.productId === productId && item.productType === productType
    );

    if (item) {
      await removeFromWishlist(item.id);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (
    productId: string,
    productType: "product" | "blog" = "product"
  ): boolean => {
    return wishlistItems.some(
      (item) => item.productId === productId && item.productType === productType
    );
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!user) return;

    try {
      const deletePromises = wishlistItems.map((item) =>
        deleteDoc(doc(db, "wishlist", item.id))
      );
      await Promise.all(deletePromises);
      setWishlistItems([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw new Error("Failed to clear wishlist");
    }
  };

  // Get wishlist stats
  const getWishlistStats = () => {
    const stats = {
      totalItems: wishlistItems.length,
      totalValue: wishlistItems.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      ),
      categories: {} as { [key: string]: number },
      recentlyAdded: wishlistItems.slice(0, 5),
    };

    wishlistItems.forEach((item) => {
      stats.categories[item.category] =
        (stats.categories[item.category] || 0) + 1;
    });

    return stats;
  };

  // Initial fetch and user change effect
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    removeByProductId,
    isInWishlist,
    clearWishlist,
    refreshWishlist: fetchWishlist,
    getWishlistStats,
  };
}
