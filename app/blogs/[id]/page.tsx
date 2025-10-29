"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import LikeButton from "@/components/blog/LikeButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function SingleBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id as string);
    }
  }, [params.id]);

  const fetchBlog = async (blogId: string) => {
    try {
      setLoading(true);
      const blogDoc = await getDoc(doc(db, "blogs", blogId));
      if (blogDoc.exists()) {
        setBlog({ id: blogDoc.id, ...blogDoc.data() } as Blog);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center border border-slate-200">
          <p className="text-slate-500 text-lg mb-4">Article not found</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/blogs">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors">
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Articles
          </Link>
        </Button>

        {/* Blog Content */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative w-full h-[400px] overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Badge
                variant="secondary"
                className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-1.5 text-sm font-medium">
                {blog.category}
              </Badge>
              <span className="text-sm text-slate-500">
                {formatDate(blog.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1
              className={`${playfair.className} text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight`}>
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light border-l-4 border-blue-500 pl-6 italic">
                {blog.excerpt}
              </p>
            )}

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-8 mb-8 border-b border-slate-200">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  {blog.author}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-slate max-w-none mb-12">
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">
                {blog.content}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 pt-8 mt-8">
              {/* Like Button Section */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <LikeButton
                    blogId={blog.id}
                    initialLikes={blog.likes || 0}
                    size="lg"
                  />
                  <p className="text-sm text-slate-500">
                    {blog.likes === 1
                      ? "1 person likes this"
                      : `${blog.likes || 0} people like this`}
                  </p>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 mr-2">Share:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="gap-2">
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Placeholder */}
        <div className="mt-12">
          <h2
            className={`${playfair.className} text-2xl font-bold text-slate-900 mb-6`}>
            Continue Reading
          </h2>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/blogs">Browse All Articles →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
