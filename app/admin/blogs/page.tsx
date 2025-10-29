"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminLayout from "../AdminLayout";
import CreateEditBlogModal from "./CreateEditBlogModal";
import BlogStats from "./components/BlogStats";
import BlogGridView from "./components/BlogGridView";
import BlogTableView from "./components/BlogTableView";
import TopLikedBlogs from "./components/TopLikedBlogs";
import { useAuth } from "@/components/context/AuthContext";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const { user, userProfile } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsQuery = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(blogsQuery);
      const blogsData = querySnapshot.docs.map((doc) => ({
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

  const handleTogglePublish = async (
    blogId: string,
    currentStatus: boolean
  ) => {
    try {
      const newStatus = currentStatus ? "draft" : "published";
      await updateDoc(doc(db, "blogs", blogId), {
        status: newStatus,
        isPublished: !currentStatus,
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update publish status");
    }
  };

  const handleUpdateStatus = async (
    blogId: string,
    newStatus: "draft" | "pending" | "published"
  ) => {
    try {
      await updateDoc(doc(db, "blogs", blogId), {
        status: newStatus,
        isPublished: newStatus === "published",
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (blogId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "blogs", blogId));
      alert("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditModalOpen(true);
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

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`${playfair.className} text-3xl font-bold text-gray-900`}>
              Blog Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage all blog posts and articles
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              size="sm">
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              size="sm">
              Table
            </Button>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>

        {/* Stats */}
        <BlogStats blogs={blogs} />

        {/* Top Liked Blogs */}
        <TopLikedBlogs blogs={blogs} limit={5} />

        {/* Grid or Table View */}
        {viewMode === "grid" ? (
          <BlogGridView
            blogs={blogs}
            loading={loading}
            onEdit={handleEditBlog}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
            formatDate={formatDate}
          />
        ) : (
          <BlogTableView
            blogs={blogs}
            loading={loading}
            onEdit={handleEditBlog}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
            formatDate={formatDate}
          />
        )}

        {/* Modals */}
        <CreateEditBlogModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={fetchBlogs}
          adminMode={true}
          userProfile={userProfile}
        />
        {selectedBlog && (
          <CreateEditBlogModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedBlog(null);
            }}
            onSuccess={fetchBlogs}
            blog={selectedBlog}
            adminMode={true}
            userProfile={userProfile}
          />
        )}
      </div>
    </AdminLayout>
  );
}
