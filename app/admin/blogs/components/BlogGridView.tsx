"use client";

import { Blog } from "@/types/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Heart,
  User,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

interface BlogGridViewProps {
  blogs: Blog[];
  loading: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (blogId: string, title: string) => void;
  onUpdateStatus: (
    blogId: string,
    newStatus: "draft" | "pending" | "published"
  ) => void;
  formatDate: (timestamp: any) => string;
}

export default function BlogGridView({
  blogs,
  loading,
  onEdit,
  onDelete,
  onUpdateStatus,
  formatDate,
}: BlogGridViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600">Published</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending Review</Badge>;
      case "draft":
        return <Badge className="bg-orange-500">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
            <span className="ml-3 text-gray-600">Loading blogs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center py-12 text-gray-500">
            No blogs created yet. Click "New Article" to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>All Blog Posts</CardTitle>
        <CardDescription>Grid view of all articles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Cover Image */}
              {blog.coverImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700">
                    {blog.category}
                  </Badge>
                  {getStatusBadge(
                    blog.status || (blog.isPublished ? "published" : "draft")
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-lg">
                  {blog.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {blog.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Author Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{blog.author}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{blog.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        onClick={() => onEdit(blog)}>
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        onClick={() => onDelete(blog.id, blog.title)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Status Change Buttons */}
                    <div className="flex gap-2">
                      {(blog.status === "pending" ||
                        blog.status === "draft") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                          onClick={() => onUpdateStatus(blog.id, "published")}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Publish
                        </Button>
                      )}
                      {blog.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300"
                          onClick={() => onUpdateStatus(blog.id, "pending")}>
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Submit
                        </Button>
                      )}
                      {blog.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                          onClick={() => onUpdateStatus(blog.id, "draft")}>
                          <EyeOff className="h-3.5 w-3.5 mr-1" />
                          Unpublish
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
