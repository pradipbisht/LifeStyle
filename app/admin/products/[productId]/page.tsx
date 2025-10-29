"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { Product, Category, AffiliateProvider } from "@/lib/types/shop";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AdminLayout from "../../AdminLayout";
import BasicInfoSection from "../new/components/BasicInfoSection";
import PricingSection from "../new/components/PricingSection";
import SaleTypeSection from "../new/components/SaleTypeSection";
import ImageUploadSection from "../new/components/ImageUploadSection";
import SpecificationsSection from "../new/components/SpecificationsSection";
import ProductStatusSection from "../new/components/ProductStatusSection";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          const productData = {
            id: productDoc.id,
            ...productDoc.data(),
          } as Product;
          setProduct(productData);

          // Populate form with existing data
          setFormData({
            name: productData.name || "",
            description: productData.description || "",
            category: productData.category || "",
            subcategory: productData.subcategory || "",
            brand: productData.brand || "",
            price: productData.price?.toString() || "",
            originalPrice: productData.originalPrice?.toString() || "",
            currency: productData.currency || "INR",
            saleType: productData.saleType || "affiliate",
            affiliateProvider: productData.affiliateProvider || "amazon",
            affiliateLink: productData.affiliateUrl || "",
            stock: productData.stock?.toString() || "",
            inStock: productData.inStock ?? true,
            isActive: productData.isActive ?? true,
            isFeatured: productData.isFeatured ?? false,
            isNew: productData.isNew ?? false,
            tags: productData.tags?.join(", ") || "",
            specifications: {
              weight: productData.specifications?.weight || "",
              dimensions: productData.specifications?.dimensions || "",
              ingredients: productData.specifications?.ingredients || "",
              usage: productData.specifications?.usage || "",
            },
          });

          // Set existing images
          setExistingImageUrls(productData.images || []);
        } else {
          toast.error("Product not found");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

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
    const totalImages = existingImageUrls.length + images.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const fileName = `${productId}_${timestamp}_${index}.jpg`;
      const storageRef = ref(storage, `products/${fileName}`);
      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload new images if any
      const newImageUrls = await uploadImages();
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      if (allImageUrls.length === 0) {
        toast.error("Please add at least one product image");
        setSaving(false);
        return;
      }

      // Prepare update data
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price),
        currency: formData.currency,
        saleType: formData.saleType,
        inStock: formData.inStock,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        images: allImageUrls,
        thumbnail: allImageUrls[0],
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        specifications: {},
        updatedAt: serverTimestamp(),
      };

      // Add optional fields
      if (formData.subcategory) {
        updateData.subcategory = formData.subcategory;
      }

      if (formData.originalPrice) {
        updateData.originalPrice = parseFloat(formData.originalPrice);
      }

      if (formData.saleType === "affiliate") {
        updateData.affiliateProvider = formData.affiliateProvider;
        if (formData.affiliateLink) {
          updateData.affiliateUrl = formData.affiliateLink;
        }
      }

      if (formData.saleType === "direct") {
        updateData.stock = parseInt(formData.stock) || 0;
      }

      // Add specifications
      Object.entries(formData.specifications).forEach(([key, value]) => {
        if (value) {
          updateData.specifications[key] = value;
        }
      });

      // Update product in Firestore
      await updateDoc(doc(db, "products", productId), updateData);

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-600">{product.name}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/shop/${product.id}`} target="_blank">
              <Button variant="outline">View Product</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          <ImageUploadSection
            imagePreviews={imagePreviews}
            handleImageSelect={handleImageSelect}
            removeImage={removeNewImage}
            existingImages={existingImageUrls}
            removeExistingImage={removeExistingImage}
          />

          <PricingSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          <SaleTypeSection
            formData={formData}
            handleSelectChange={handleSelectChange}
            handleInputChange={handleInputChange}
          />

          <SpecificationsSection
            formData={formData}
            handleSpecChange={handleSpecChange}
          />

          <ProductStatusSection
            formData={formData}
            handleCheckboxChange={handleCheckboxChange}
          />

          {/* Submit Button at Bottom */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
