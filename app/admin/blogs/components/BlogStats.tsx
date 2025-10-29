"use client";

import { Blog } from "@/types/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { FileText, Eye, EyeOff, Clock, TrendingUp } from "lucide-react";

interface BlogStatsProps {
  blogs: Blog[];
}

export default function BlogStats({ blogs }: BlogStatsProps) {
  const publishedCount = blogs.filter(
    (b) => b.status === "published" || b.isPublished
  ).length;
  const draftCount = blogs.filter((b) => b.status === "draft").length;
  const pendingCount = blogs.filter((b) => b.status === "pending").length;
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="bg-linear-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-blue-700 font-medium">
              Total Blogs
            </CardDescription>
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-900">{blogs.length}</div>
          <p className="text-xs text-blue-700 mt-2">All articles</p>
        </CardContent>
      </Card>

      <Card className="bg-linear-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-green-700 font-medium">
              Published
            </CardDescription>
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-900">
            {publishedCount}
          </div>
          <p className="text-xs text-green-700 mt-2">Live articles</p>
        </CardContent>
      </Card>

      <Card className="bg-linear-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-yellow-700 font-medium">
              Pending Review
            </CardDescription>
            <div className="h-10 w-10 rounded-lg bg-yellow-600 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-yellow-900">
            {pendingCount}
          </div>
          <p className="text-xs text-yellow-700 mt-2">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card className="bg-linear-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-orange-700 font-medium">
              Drafts
            </CardDescription>
            <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <EyeOff className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-orange-900">{draftCount}</div>
          <p className="text-xs text-orange-700 mt-2">Work in progress</p>
        </CardContent>
      </Card>

      <Card className="bg-linear-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-purple-700 font-medium">
              Total Likes
            </CardDescription>
            <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-purple-900">{totalLikes}</div>
          <p className="text-xs text-purple-700 mt-2">All time</p>
        </CardContent>
      </Card>
    </div>
  );
}
