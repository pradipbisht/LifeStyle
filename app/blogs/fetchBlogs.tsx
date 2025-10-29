"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Blog } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Heart } from "lucide-react";
import Link from "next/link";
import LikeButton from "@/components/blog/LikeButton";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setLoading(true);
      const blogsQuery = query(
        collection(db, "blogs"),
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const snapshot = await getDocs(blogsQuery);
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];

      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
        <span className="ml-3 text-gray-600 text-lg">Loading articles...</span>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles published yet.</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className={`${playfair.className} text-4xl font-bold text-gray-900 mb-4`}>
            Latest Articles
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our newest wellness tips, health advice, and lifestyle
            insights
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-slate-200 bg-white">
              {/* Cover Image */}
              <Link href={`/blogs/${blog.id}`}>
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  {/* Category Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
                      {blog.category}
                    </Badge>
                  </div>
                </div>
              </Link>

              <CardHeader className="pb-3">
                {/* Title */}
                <CardTitle className="line-clamp-2 text-xl group-hover:text-blue-600 transition-colors">
                  <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                </CardTitle>

                {/* Excerpt */}
                <p className="text-sm text-slate-600 line-clamp-2 mt-2">
                  {blog.excerpt}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{blog.likes || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3">
                  <LikeButton
                    blogId={blog.id}
                    initialLikes={blog.likes || 0}
                    size="sm"
                  />
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 group/btn">
                    <Link href={`/blogs/${blog.id}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
            <Link href="/blogs">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
