"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { Category, AffiliateProvider } from "@/lib/types/shop";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminLayout from "../../AdminLayout";
import BasicInfoSection from "./components/BasicInfoSection";
import PricingSection from "./components/PricingSection";
import SaleTypeSection from "./components/SaleTypeSection";
import ImageUploadSection from "./components/ImageUploadSection";
import SpecificationsSection from "./components/SpecificationsSection";
import ProductStatusSection from "./components/ProductStatusSection";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "" as Category | "",
    subcategory: "",
    brand: "",
    price: "",
    originalPrice: "",
    currency: "INR" as "INR" | "USD",
    saleType: "affiliate" as "affiliate" | "direct",
    affiliateProvider: "amazon" as AffiliateProvider,
    affiliateLink: "",
    stock: "",
    inStock: true,
    isActive: true,
    isFeatured: false,
    isNew: false,
    tags: "",
    specifications: {
      weight: "",
      dimensions: "",
      ingredients: "",
      usage: "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSpecChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${index}_${image.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, image);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls = images.length > 0 ? await uploadImages() : [];

      // Prepare product data
      const productData: any = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        shortDescription: formData.description.substring(0, 150),
        category: formData.category as Category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        price: parseFloat(formData.price),
        currency: formData.currency,
        saleType: formData.saleType,
        images: imageUrls,
        thumbnail: imageUrls[0] || "",
        inStock: formData.inStock,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        rating: 0,
        reviews: 0,
        features: [],
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        specifications: formData.specifications,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add optional fields only if they have values
      if (formData.originalPrice) {
        productData.originalPrice = parseFloat(formData.originalPrice);
      }

      // Add affiliate-specific fields
      if (formData.saleType === "affiliate") {
        productData.affiliateProvider = formData.affiliateProvider;
        if (formData.affiliateLink) {
          productData.affiliateUrl = formData.affiliateLink;
        }
      }

      // Add direct sale-specific fields
      if (formData.saleType === "direct") {
        productData.stock = parseInt(formData.stock) || 0;
      }

      // Add to Firestore
      await addDoc(collection(db, "products"), productData);

      alert("Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-600 mt-1">Create a new product listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          {/* Pricing */}
          <PricingSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          {/* Sale Type */}
          <SaleTypeSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          {/* Images */}
          <ImageUploadSection
            imagePreviews={imagePreviews}
            handleImageSelect={handleImageSelect}
            removeImage={removeImage}
          />

          {/* Specifications */}
          <SpecificationsSection
            formData={formData}
            handleSpecChange={handleSpecChange}
          />

          {/* Status */}
          <ProductStatusSection
            formData={formData}
            handleCheckboxChange={handleCheckboxChange}
          />

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700">
              {loading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
