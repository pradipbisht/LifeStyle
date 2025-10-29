"use client";

import { Blog } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import LikeButton from "@/components/blog/LikeButton";

interface BlogGridProps {
  blogs: Blog[];
  formatDate: (timestamp: any) => string;
}

export default function BlogGrid({ blogs, formatDate }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  No Image
                </div>
              )}
              {/* Category Badge */}
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
            <p className="text-sm text-slate-600 line-clamp-3 mt-2">
              {blog.excerpt}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="text-xs">{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">{formatDate(blog.createdAt)}</span>
                </div>
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
                  Read
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
