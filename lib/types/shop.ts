// Product types and interfaces

import { Timestamp } from "firebase/firestore";

export type Category =
  | "health"
  | "skincare"
  | "haircare"
  | "pets"
  | "parenting";

export type SaleType = "affiliate" | "direct";

export type AffiliateProvider = "amazon" | "flipkart" | "custom";

export interface ProductSpecifications {
  weight?: string;
  size?: string;
  dimensions?: string;
  ingredients?: string;
  usage?: string;
  color?: string;
  scent?: string;
  ageGroup?: string;
  petType?: "dog" | "cat" | "both";
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;

  category: Category;
  subcategory: string;
  tags: string[];

  price: number;
  originalPrice?: number;
  currency: "INR" | "USD";
  discount?: number;

  images: string[];
  thumbnail: string;

  shortDescription: string;
  description: string;
  features: string[];

  specifications: ProductSpecifications;

  saleType: SaleType;
  affiliateUrl?: string;
  affiliateProvider?: AffiliateProvider;

  inStock: boolean;
  stock?: number; // for direct sales
  stockCount?: number; // legacy field

  rating: number;
  reviews: number; // number of reviews
  reviewCount: number; // legacy field

  isFeatured: boolean;
  isExpertChoice: boolean;
  isTrending: boolean;
  isNew: boolean;

  metaTitle: string;
  metaDescription: string;

  relatedProducts?: string[];

  viewCount: number;
  clickCount: number;

  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  saleType: SaleType;
  affiliateUrl?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];

  subtotal: number;
  shipping: number;
  tax: number;
  total: number;

  customerName: string;
  email: string;
  phone: string;

  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
