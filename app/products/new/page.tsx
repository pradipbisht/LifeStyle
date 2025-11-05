"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/lib/types/shop";
import { ProductChromeGrid } from "@/components/ProductChromeGrid";
import { useWishlistContext } from "@/components/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

export default function NewProductsPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist } = useWishlistContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch featured products - simplified query
        const featuredQuery = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("isFeatured", "==", true),
          limit(12) // Get more to sort in JS
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const featured = featuredSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Sort by createdAt in JavaScript and take top 6
        const sortedFeatured = featured
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          })
          .slice(0, 6);

        // Fetch trending products - simplified query
        const trendingQuery = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("isTrending", "==", true),
          limit(12) // Get more to sort in JS
        );
        const trendingSnapshot = await getDocs(trendingQuery);
        const trending = trendingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Sort by viewCount in JavaScript and take top 6
        const sortedTrending = trending
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 6);

        // Fetch new products - simplified query
        const newQuery = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("isNew", "==", true),
          limit(12) // Get more to sort in JS
        );
        const newSnapshot = await getDocs(newQuery);
        const newProds = newSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Sort by createdAt in JavaScript and take top 6
        const sortedNew = newProds
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          })
          .slice(0, 6);

        setFeaturedProducts(sortedFeatured);
        setTrendingProducts(sortedTrending);
        setNewProducts(sortedNew);
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
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-100 animate-pulse rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-r from-amber-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white to-amber-100 bg-clip-text text-transparent">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Experience our revolutionary ChromeGrid display with interactive product exploration
          </p>
          <Badge className="text-lg px-6 py-2 bg-white/20 text-white border-white/30">
            <Sparkles className="h-5 w-5 mr-2" />
            Interactive Shopping Experience
          </Badge>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="h-8 w-8 text-amber-600" />
                <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked products that deliver exceptional value and quality
              </p>
            </div>

            <ProductChromeGrid
              products={featuredProducts}
              columns={3}
              radius={400}
              onAddToWishlist={handleAddToWishlist}
              className="mb-8"
            />

            <div className="text-center">
              <Link href="/shop?filter=featured">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 px-8">
                  View All Featured
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <h2 className="text-4xl font-bold text-gray-900">Trending Now</h2>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Most popular products loved by our community
              </p>
            </div>

            <ProductChromeGrid
              products={trendingProducts}
              columns={3}
              radius={350}
              onAddToWishlist={handleAddToWishlist}
              className="mb-8"
            />

            <div className="text-center">
              <Link href="/shop?filter=trending">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8">
                  View All Trending
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
                <h2 className="text-4xl font-bold text-gray-900">What's New</h2>
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Latest additions to our growing collection
              </p>
            </div>

            <ProductChromeGrid
              products={newProducts}
              columns={3}
              radius={300}
              onAddToWishlist={handleAddToWishlist}
              className="mb-8"
            />

            <div className="text-center">
              <Link href="/shop?filter=new">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                  View All New
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Explore More?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit our complete shop to discover thousands of products across all categories
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 px-8 py-4 text-lg">
              Browse All Products
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}