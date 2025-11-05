// User Dashboard Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  preferences: UserPreferences;
  addresses: Address[];
}

export interface UserPreferences {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  interests: string[];
}

export interface Address {
  id: string;
  type: "home" | "office" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  wishlistItems: number;
  loyaltyPoints: number;
  totalSpent: number;
  savedAmount: number;
}

export interface RecentActivity {
  id: string;
  type: "order" | "review" | "wishlist" | "blog" | "reward";
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  url?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  addedAt: Date;
  inStock: boolean;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  expiresAt?: Date;
  isRedeemed: boolean;
  redeemedAt?: Date;
}

export interface Recommendation {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  category: string;
  reason: string;
  confidence: number;
}
