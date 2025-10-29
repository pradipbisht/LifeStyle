"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { Blog } from "@/types/blog";
import ImageUploadSection from "./components/ImageUploadSection";
import BlogFormFields from "./components/BlogFormFields";
import { useAuth } from "@/components/context/AuthContext";

interface CreateEditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog?: Blog | null;
  adminMode?: boolean;
  userProfile?: { username: string; uid?: string } | null;
}

export default function CreateEditBlogModal({
  isOpen,
  onClose,
  onSuccess,
  blog,
  adminMode = false,
  userProfile,
}: CreateEditBlogModalProps) {
  const { user } = useAuth(); // Get user with uid
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Health & Lifestyle",
    coverImage: "",
    status: "draft" as "draft" | "pending" | "published",
    author: "",
    authorId: "",
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        coverImage: blog.coverImage || "",
        status: blog.status || (blog.isPublished ? "published" : "draft"),
        author: blog.author,
        authorId: blog.authorId,
      });
      setImagePreview(blog.coverImage || "");
    } else if (userProfile) {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "Health & Lifestyle",
        coverImage: "",
        status: "draft",
        author: userProfile.username,
        authorId: user?.uid || "",
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [blog, userProfile, isOpen, user]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (): Promise<string> => {
    if (!imageFile) return formData.coverImage;
    try {
      setUploading(true);
      const timestamp = Date.now();
      const filename = `blog-covers/${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, coverImage: "" });
    setImagePreview("");
    setImageFile(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (saveType: "draft" | "pending" | "published") => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      let coverImageUrl = formData.coverImage;
      if (imageFile) {
        coverImageUrl = await uploadImageToStorage();
      }

      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        authorId: formData.authorId,
        coverImage: coverImageUrl,
        status: saveType,
        isPublished: saveType === "published",
        updatedAt: serverTimestamp(),
      };

      if (blog) {
        await updateDoc(doc(db, "blogs", blog.id), blogData);
        alert(
          saveType === "published"
            ? "Blog published successfully!"
            : saveType === "pending"
            ? "Blog submitted for review!"
            : "Blog saved as draft!"
        );
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogData,
          likes: 0,
          dislikes: 0,
          createdAt: serverTimestamp(),
        });
        alert(
          saveType === "published"
            ? "Blog published successfully!"
            : saveType === "pending"
            ? "Blog submitted for review!"
            : "Blog saved as draft!"
        );
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Health & Lifestyle",
      coverImage: "",
      status: "draft",
      author: userProfile?.username || "",
      authorId: userProfile?.uid || "",
    });
    setImagePreview("");
    setImageFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {blog ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
          {/* Image Upload */}
          <ImageUploadSection
            imagePreview={imagePreview}
            imageFile={imageFile}
            onImageChange={handleImageFileChange}
            onRemoveImage={removeImage}
          />

          {/* Form Fields */}
          <BlogFormFields
            formData={formData}
            onFormChange={handleFormChange}
            adminMode={adminMode}
          />

          {/* Status Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <Label className="text-sm font-medium text-blue-900">
              Publication Status
            </Label>
            <p className="text-xs text-blue-700 mt-1">
              {adminMode
                ? "As admin, you can save as draft, submit for review, or publish directly."
                : "Save as draft to continue editing, or submit for admin review before publishing."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {!adminMode && (
              <>
                <Button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  disabled={loading || uploading}
                  variant="outline"
                  className="flex-1">
                  {uploading
                    ? "Uploading..."
                    : loading
                    ? "Saving..."
                    : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit("pending")}
                  disabled={loading || uploading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                  {uploading
                    ? "Uploading..."
                    : loading
                    ? "Submitting..."
                    : "Submit for Review"}
                </Button>
              </>
            )}
            {adminMode && (
              <>
                <Button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  disabled={loading || uploading}
                  variant="outline"
                  className="flex-1">
                  {uploading
                    ? "Uploading..."
                    : loading
                    ? "Saving..."
                    : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit("pending")}
                  disabled={loading || uploading}
                  variant="outline"
                  className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900">
                  {uploading
                    ? "Uploading..."
                    : loading
                    ? "Saving..."
                    : "Mark Pending"}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit("published")}
                  disabled={loading || uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700">
                  {uploading
                    ? "Uploading..."
                    : loading
                    ? "Publishing..."
                    : "Publish Now"}
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
              disabled={loading || uploading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
