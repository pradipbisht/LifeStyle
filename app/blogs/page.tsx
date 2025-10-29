"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { Blog } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import { Playfair_Display } from "next/font/google";
import CategoryFilter from "./components/CategoryFilter";
import BlogGrid from "./components/BlogGrid";
import BlogList from "./components/BlogList";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Filter blogs when category changes
    if (selectedCategory === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter((blog) => blog.category === selectedCategory)
      );
    }
  }, [selectedCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      // Simple query - no index needed
      const blogsQuery = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(blogsQuery);
      const allBlogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];

      // Filter published blogs in JavaScript
      const publishedBlogs = allBlogs.filter(
        (blog) => blog.status === "published" || blog.isPublished === true
      );

      setBlogs(publishedBlogs);
      setFilteredBlogs(publishedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(blogs.map((blog) => blog.category)));

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
              Blog & Articles
            </h1>
            <p className="text-gray-600">
              Discover wellness tips, health advice, and lifestyle insights
            </p>
          </div>
          {isAuthenticated && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/blogs/create">
                <Plus className="h-4 w-4 mr-2" />
                Write Article
              </Link>
            </Button>
          )}
        </div>

        {/* Category Filter */}
        {!loading && blogs.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}

        {/* Blog Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
            <span className="ml-3 text-gray-600 text-lg">
              Loading articles...
            </span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg mb-4">
                {selectedCategory === "All"
                  ? "No articles published yet."
                  : `No articles found in "${selectedCategory}" category.`}
              </p>
              {isAuthenticated && selectedCategory === "All" && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/blogs/create">Be the first to write!</Link>
                </Button>
              )}
              {selectedCategory !== "All" && (
                <Button
                  onClick={() => setSelectedCategory("All")}
                  variant="outline">
                  View All Articles
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <BlogGrid blogs={filteredBlogs} formatDate={formatDate} />
        ) : (
          <BlogList blogs={filteredBlogs} formatDate={formatDate} />
        )}
      </div>
    </div>
  );
}
