// Wishlist TypeScript Interfaces
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  productType: "product" | "blog"; // Can wishlist products or blogs
  name: string;
  description?: string;
  image: string;
  price?: number;
  originalPrice?: number;
  category: string;
  author?: string; // For blogs
  addedAt: Date;
  inStock?: boolean;
  isAvailable: boolean;
  url: string; // Link to product/blog page
}

export interface WishlistStats {
  totalItems: number;
  categories: { [key: string]: number };
  totalValue: number; // For products only
  recentlyAdded: WishlistItem[];
}

export interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (
    item: Omit<WishlistItem, "id" | "userId" | "addedAt">
  ) => Promise<WishlistItem>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  removeByProductId: (
    productId: string,
    productType?: "product" | "blog"
  ) => Promise<void>;
  isInWishlist: (
    productId: string,
    productType?: "product" | "blog"
  ) => boolean;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}
