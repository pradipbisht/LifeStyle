"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/lib/types/shop";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CURRENCY_SYMBOLS } from "@/lib/shop-constants";
import { useCart } from "@/lib/context/CartContext";
import { toast } from "sonner";

export default function TopProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("isActive", "==", true), limit(6));
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <section className="py-12 bg-linear-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg mx-auto mb-2"></div>
            <div className="h-4 w-64 bg-gray-100 animate-pulse rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3"></div>
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 bg-linear-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-serif">
              Our Products
            </h2>
            <p className="text-gray-600 text-sm">
              Discover premium wellness products
            </p>
          </div>
          <div className="max-w-md mx-auto text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Products Yet
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Import sample products to get started
            </p>
            <Link href="/admin/products/import">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Import Sample Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-serif">
            Our Products
          </h2>
          <p className="text-gray-600 text-sm">
            Carefully curated products for your wellness needs
          </p>
        </div>

        {/* Products Grid - 3x2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group relative
                         bg-white rounded-2xl border border-gray-100 // Adjusted card background, border, shadow
                         overflow-hidden transform transition-all duration-300
                         hover:-translate-y-1 hover:shadow-xl hover:border-amber-200">
              {" "}
              {/* Enhanced hover effects */}
              <CardContent className="p-0">
                <Link href={`/shop/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                    {" "}
                    {/* Adjusted rounded corners */}
                    <Image
                      src={
                        product.thumbnail ||
                        product.images?.[0] ||
                        "/placeholder.jpg"
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover object-center 
                                 transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105" // Slightly less aggressive zoom on hover
                    />
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-linear-to-br from-amber-500 to-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                        {" "}
                        {/* Enhanced 'New' badge */}
                        New
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {" "}
                    {/* Reduced padding slightly for a tighter look */}
                    <h3 className="text-base md:text-lg font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
                      {" "}
                      {/* Adjusted font size and color */}
                      {product.name}
                    </h3>
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  {" "}
                  {/* Adjusted padding */}
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md hover:shadow-lg // Adjusted button roundedness
                               transform transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2 font-semibold">
                    {" "}
                    {/* Added font-semibold */}
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/shop">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 rounded-full">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
