"use client";

import { Blog } from "@/types/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

interface TopLikedBlogsProps {
  blogs: Blog[];
  limit?: number;
}

export default function TopLikedBlogs({
  blogs,
  limit = 5,
}: TopLikedBlogsProps) {
  // Sort by likes and get top N
  const topBlogs = [...blogs]
    .filter((b) => b.status === "published" || b.isPublished)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, limit);

  if (topBlogs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <CardTitle>Most Popular Articles</CardTitle>
        </div>
        <CardDescription>Top {limit} most liked blog posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              {/* Rank Badge */}
              <div
                className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0
                    ? "bg-yellow-400 text-yellow-900"
                    : index === 1
                    ? "bg-gray-300 text-gray-700"
                    : index === 2
                    ? "bg-orange-300 text-orange-900"
                    : "bg-gray-200 text-gray-600"
                }`}>
                {index + 1}
              </div>

              {/* Blog Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link
                    href={`/blogs/${blog.id}`}
                    target="_blank"
                    className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                    {blog.title}
                  </Link>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-blue-100 text-blue-700">
                    {blog.category}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {blog.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span className="font-semibold text-gray-700">
                      {blog.likes || 0} likes
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>by {blog.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length > limit && (
          <p className="text-sm text-gray-500 text-center mt-4 pt-4 border-t">
            Showing top {limit} of{" "}
            {
              blogs.filter((b) => b.status === "published" || b.isPublished)
                .length
            }{" "}
            published articles
          </p>
        )}
      </CardContent>
    </Card>
  );
}
