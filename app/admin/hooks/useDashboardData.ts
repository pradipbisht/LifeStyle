import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalComments: number;
  totalLikes: number;
  totalProducts: number;
  activeProducts: number;
  totalContacts: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: "user" | "blog" | "comment" | "product";
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalComments: 0,
    totalLikes: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalContacts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Just now";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch Users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map((doc) => doc.data());
      const verifiedCount = users.filter((u: any) => u.isVerified).length;

      // Fetch Blogs
      const blogsSnapshot = await getDocs(collection(db, "blogs"));
      const blogs = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const publishedCount = blogs.filter(
        (b: any) => b.status === "published"
      ).length;
      const totalLikes = blogs.reduce(
        (sum: number, b: any) => sum + (b.likes || 0),
        0
      );

      // Fetch Comments
      const commentsSnapshot = await getDocs(collection(db, "comments"));

      // Fetch Products
      const productsSnapshot = await getDocs(collection(db, "products"));
      const products = productsSnapshot.docs.map((doc) => doc.data());
      const activeProductsCount = products.filter(
        (p: any) => p.isActive
      ).length;

      // Fetch Contacts
      const contactsSnapshot = await getDocs(collection(db, "contacts"));

      setStats({
        totalUsers: usersSnapshot.size,
        verifiedUsers: verifiedCount,
        totalBlogs: blogsSnapshot.size,
        publishedBlogs: publishedCount,
        totalComments: commentsSnapshot.size,
        totalLikes,
        totalProducts: productsSnapshot.size,
        activeProducts: activeProductsCount,
        totalContacts: contactsSnapshot.size,
      });

      // Build recent activity
      const activities: RecentActivity[] = [];

      // Recent users (last 3)
      const recentUsers = usersSnapshot.docs.slice(0, 3);
      recentUsers.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          action: "New user registered",
          user: data.email || data.username,
          time: formatTimestamp(data.timestamp),
          type: "user",
        });
      });

      // Recent blogs (last 3)
      const recentBlogs = blogs
        .sort((a: any, b: any) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        })
        .slice(0, 3);

      recentBlogs.forEach((blog: any) => {
        activities.push({
          id: blog.id,
          action: `Blog ${
            blog.status === "published" ? "published" : "created"
          }`,
          user: blog.author || "Admin",
          time: formatTimestamp(blog.createdAt),
          type: "blog",
        });
      });

      // Recent products (last 2)
      const recentProducts = productsSnapshot.docs.slice(0, 2);
      recentProducts.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          action: "Product added",
          user: data.name,
          time: formatTimestamp(data.createdAt),
          type: "product",
        });
      });

      // Sort by time and take top 8
      setRecentActivity(activities.slice(0, 8));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { stats, recentActivity, loading };
}
