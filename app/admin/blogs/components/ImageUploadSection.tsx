"use client";

import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadSectionProps {
  imagePreview: string;
  imageFile: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function ImageUploadSection({
  imagePreview,
  imageFile,
  onImageChange,
  onRemoveImage,
}: ImageUploadSectionProps) {
  return (
    <div>
      <Label htmlFor="coverImage">Cover Image</Label>
      <div className="mt-2">
        {!imagePreview ? (
          <label
            htmlFor="coverImageFile"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
            </div>
            <input
              id="coverImageFile"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={onRemoveImage}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs">
              {imageFile
                ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
                : "Existing image"}
            </div>
          </div>
        )}
      </div>
      {imageFile && (
        <p className="text-xs text-green-600 mt-2">
          ✓ New image selected: {imageFile.name}
        </p>
      )}
    </div>
  );
}
