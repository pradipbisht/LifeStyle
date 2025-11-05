"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/lib/types/shop";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/shop-constants";

// Import new components
import ProductHeader from "@/components/product/ProductHeader";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPriceCard from "@/components/product/ProductPriceCard";
import ProductStockStatus from "@/components/product/ProductStockStatus";
import ProductActions from "@/components/product/ProductActions";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import ProductDetailsTabs from "@/components/product/ProductDetailsTabs";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", productId));

        if (productDoc.exists()) {
          setProduct({
            id: productDoc.id,
            ...productDoc.data(),
          } as Product);
        } else {
          router.push("/shop");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = (quantity: number) => {
    // TODO: Implement cart functionality
    alert(`Added ${quantity} x ${product?.name} to cart!`);
  };

  const handleBuyNow = () => {
    if (product?.saleType === "affiliate" && product.affiliateUrl) {
      window.open(product.affiliateUrl, "_blank");
    } else {
      // TODO: Redirect to checkout
      alert("Redirecting to checkout...");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-6 lg:p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const category = CATEGORIES.find((c) => c.value === product.category);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-amber-600 transition-colors">
            {category?.label}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Product Header */}
          <div className="p-6 lg:p-8">
            <ProductHeader product={product} />

            {/* Main Content Grid - Single Column for smaller width */}
            <div className="space-y-8">
              {/* Image Gallery */}
              <ProductImageGallery product={product} />

              {/* Product Info Section */}
              <div className="space-y-6">
                <ProductPriceCard product={product} />
                <ProductStockStatus product={product} />
                <ProductActions
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
                <ProductTrustBadges />
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <ProductDetailsTabs product={product} />
        </div>

        {/* Related Products Placeholder */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            You Might Also Like
          </h2>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/shop">Browse More Products →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
