import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadSectionProps {
  imagePreviews: string[];
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  existingImages?: string[];
  removeExistingImage?: (index: number) => void;
}

export default function ImageUploadSection({
  imagePreviews,
  handleImageSelect,
  removeImage,
  existingImages = [],
  removeExistingImage,
}: ImageUploadSectionProps) {
  const totalImages = existingImages.length + imagePreviews.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="images">Upload Images (Max 5)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("images")?.click()}
              disabled={totalImages >= 5}>
              <Upload className="mr-2 h-4 w-4" />
              Choose Images
            </Button>
            <span className="text-sm text-gray-500">
              {totalImages}/5 images
            </span>
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Current Images
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <Image
                    src={url}
                    alt={`Existing ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover aspect-square"
                  />
                  {removeExistingImage && (
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        {imagePreviews.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">New Images</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
