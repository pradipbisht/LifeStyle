import {
  DashboardStats,
  RecentActivity,
  Recommendation,
} from "@/app/types/user-dashboard";

export const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "", // Add avatar URL
};

export const mockStats: DashboardStats = {
  totalOrders: 12,
  pendingOrders: 2,
  wishlistItems: 8,
  loyaltyPoints: 850,
  totalSpent: 1249.99,
  savedAmount: 125.5,
};

export const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "order",
    title: "Order Delivered",
    description: "Organic Skincare Set has been delivered",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: "Package",
    url: "/dashboard/orders/12345",
  },
  {
    id: "2",
    type: "review",
    title: "Review Posted",
    description: "You reviewed Vitamin C Serum",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: "Star",
    url: "/dashboard/reviews",
  },
  {
    id: "3",
    type: "reward",
    title: "Points Earned",
    description: "Earned 50 points from recent purchase",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    icon: "Gift",
    url: "/dashboard/rewards",
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    productId: "p1",
    name: "Hydrating Face Moisturizer",
    image: "/images/products/moisturizer.jpg",
    price: 29.99,
    category: "Skincare",
    reason: "Based on your recent skincare purchases",
    confidence: 0.9,
  },
  {
    id: "2",
    productId: "p2",
    name: "Organic Dog Treats",
    image: "/images/products/dog-treats.jpg",
    price: 15.99,
    category: "Pets",
    reason: "Perfect for your pet's healthy diet",
    confidence: 0.85,
  },
  {
    id: "3",
    productId: "p3",
    name: "Vitamin D3 Supplement",
    image: "/images/products/vitamin-d.jpg",
    price: 24.99,
    category: "Health",
    reason: "Frequently bought with your recent orders",
    confidence: 0.8,
  },
];
