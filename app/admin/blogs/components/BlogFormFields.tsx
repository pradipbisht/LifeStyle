"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BlogFormFieldsProps {
  formData: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
  };
  onFormChange: (field: string, value: string) => void;
  adminMode?: boolean;
}

const categories = [
  "Health & Lifestyle",
  "Skincare",
  "Haircare",
  "Parenting",
  "Pets",
  "Nutrition",
  "Fitness",
  "Mental Health",
  "Other",
];

export default function BlogFormFields({
  formData,
  onFormChange,
  adminMode = false,
}: BlogFormFieldsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFormChange("title", e.target.value)}
          placeholder="Enter blog title"
          required
          className="mt-2"
        />
      </div>

      {/* Excerpt */}
      <div>
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => onFormChange("excerpt", e.target.value)}
          placeholder="Brief description (shown in blog list)"
          rows={2}
          required
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.excerpt.length}/200 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => onFormChange("category", e.target.value)}
          className="w-full mt-2 px-3 py-2 border rounded-md"
          required>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Author (Admin can edit) */}
      {adminMode && (
        <div>
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => onFormChange("author", e.target.value)}
            placeholder="Author name"
            required
            className="mt-2"
          />
        </div>
      )}

      {/* Content */}
      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => onFormChange("content", e.target.value)}
          placeholder="Write your blog content here..."
          rows={12}
          required
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.content.length} characters
        </p>
      </div>
    </>
  );
}
