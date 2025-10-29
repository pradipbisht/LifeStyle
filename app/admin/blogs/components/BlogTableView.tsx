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
import { Eye, Trash2, Edit, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface BlogTableViewProps {
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

export default function BlogTableView({
  blogs,
  loading,
  onEdit,
  onDelete,
  onUpdateStatus,
  formatDate,
}: BlogTableViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return { bg: "#dcfce7", text: "#166534" };
      case "pending":
        return { bg: "#fef3c7", text: "#92400e" };
      case "draft":
        return { bg: "#fed7aa", text: "#9a3412" };
      default:
        return { bg: "#e5e7eb", text: "#374151" };
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>All Blog Posts</CardTitle>
        <CardDescription>Complete list of all articles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => {
                const status =
                  blog.status || (blog.isPublished ? "published" : "draft");
                const colors = getStatusColor(status);

                return (
                  <tr
                    key={blog.id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{blog.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700">
                        {blog.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {blog.likes || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}>
                          {status === "published" && (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          {status === "pending" && (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(blog.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(blog)}
                          className="hover:bg-green-50 hover:text-green-700">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        {status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateStatus(blog.id, "published")}
                            className="hover:bg-green-50 hover:text-green-700">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="hover:bg-blue-50 hover:text-blue-700">
                          <Link href={`/blogs/${blog.id}`} target="_blank">
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(blog.id, blog.title)}
                          className="hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
