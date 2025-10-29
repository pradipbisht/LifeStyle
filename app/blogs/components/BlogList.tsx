"use client";

import { Blog } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import LikeButton from "@/components/blog/LikeButton";

interface BlogListProps {
  blogs: Blog[];
  formatDate: (timestamp: any) => string;
}

export default function BlogList({ blogs, formatDate }: BlogListProps) {
  return (
    <div className="space-y-6">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Cover Image */}
              <Link href={`/blogs/${blog.id}`} className="md:w-80 shrink-0">
                <div className="relative h-56 md:h-full overflow-hidden bg-slate-100">
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
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  {/* Category */}
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700 mb-3">
                    {blog.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 line-clamp-3 mb-4">
                    {blog.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <LikeButton
                    blogId={blog.id}
                    initialLikes={blog.likes || 0}
                    size="sm"
                  />
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 group/btn">
                    <Link href={`/blogs/${blog.id}`}>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
