"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/lib/types/shop";
import { ProductChromeGrid } from "@/components/ProductChromeGrid";
import { useWishlistContext } from "@/components/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TopProductChrome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist } = useWishlistContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        // Simple query without orderBy to avoid index requirement
        const q = query(productsRef, where("isActive", "==", true), limit(12));
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Sort by createdAt in JavaScript and take top 6
        const sortedProducts = allProducts
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          })
          .slice(0, 6);

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      productId: product.id,
      productType: "product",
      name: product.name,
      description: product.shortDescription,
      image: product.thumbnail || product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      isAvailable: product.inStock,
      url: `/shop/${product.id}`,
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-linear-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-100 animate-pulse rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-linear-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-r from-amber-100/20 to-orange-100/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-amber-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Top Products
            </h2>
            <Sparkles className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of premium products with
            interactive ChromeGrid technology. Move your cursor around to
            explore each product in detail.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Interactive Product Explorer
          </div>
        </div>

        {/* Chrome Grid */}
        <div className="mb-12">
          <ProductChromeGrid
            products={products}
            columns={3}
            radius={350}
            damping={0.4}
            fadeOut={0.8}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Explore All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
