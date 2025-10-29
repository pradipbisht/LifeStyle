"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/lib/types/shop";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Package,
  Truck,
  Shield,
  ShoppingCart,
  Heart,
  Share2,
  Star,
} from "lucide-react";

// import {
//   ShoppingCart,
//   Heart,
//   Share2,
//   Star,
//   ArrowLeft,
//   ExternalLink,
//   Package,
//   Truck,
//   Shield,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
import { CURRENCY_SYMBOLS, CATEGORIES } from "@/lib/shop-constants";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const handlePrevImage = () => {
    if (product) {
      setSelectedImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product) {
      setSelectedImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = () => {
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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
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
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-600">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-amber-600">
            {category?.label}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link href="/shop">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              <Image
                src={product.images[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <Badge className="bg-amber-500 text-white">Featured</Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-green-500 text-white">New</Badge>
                )}
                {discount > 0 && (
                  <Badge className="bg-red-500 text-white">-{discount}%</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-amber-500 scale-95"
                        : "border-gray-200 hover:border-amber-300"
                    }`}>
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base">
                {category?.emoji} {category?.label}
              </Badge>
              {product.brand && (
                <span className="text-sm text-gray-500">
                  by {product.brand}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {(product.rating || 0).toFixed(1)} ({product.reviews || 0}{" "}
                reviews)
              </span>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  {CURRENCY_SYMBOLS[product.currency]}
                  {product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      {CURRENCY_SYMBOLS[product.currency]}
                      {product.originalPrice}
                    </span>
                    <Badge className="bg-red-100 text-red-700 text-base">
                      Save {discount}%
                    </Badge>
                  </>
                )}
              </div>
              {product.saleType === "affiliate" &&
                product.affiliateProvider && (
                  <p className="text-sm text-gray-500 mt-2">
                    Available on{" "}
                    {product.affiliateProvider.charAt(0).toUpperCase() +
                      product.affiliateProvider.slice(1)}
                  </p>
                )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">In Stock</span>
                  {product.saleType === "direct" && product.stock && (
                    <span className="text-gray-500">
                      ({product.stock} available)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector (for direct sales only) */}
            {product.saleType === "direct" && product.inStock && (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors">
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors">
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {product.saleType === "direct" ? (
                <>
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    disabled={!product.inStock}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    disabled={!product.inStock}>
                    Buy Now
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="flex-1 bg-amber-600 hover:bg-amber-700">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Buy on{" "}
                  {product.affiliateProvider
                    ? product.affiliateProvider.charAt(0).toUpperCase() +
                      product.affiliateProvider.slice(1)
                    : "Partner Site"}
                </Button>
              )}
              <Button size="lg" variant="outline" className="px-6">
                <Heart className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-6">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over ₹500</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent px-6 py-4">
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent px-6 py-4">
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent px-6 py-4">
              Reviews ({product.reviews || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="py-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="py-8">
            <div className="grid md:grid-cols-2 gap-4">
              {product.specifications.weight && (
                <div className="border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-900">Weight:</span>
                  <span className="ml-2 text-gray-600">
                    {product.specifications.weight}
                  </span>
                </div>
              )}
              {product.specifications.dimensions && (
                <div className="border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-900">
                    Dimensions:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {product.specifications.dimensions}
                  </span>
                </div>
              )}
              {product.specifications.ingredients && (
                <div className="border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-900">
                    Ingredients:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {product.specifications.ingredients}
                  </span>
                </div>
              )}
              {product.specifications.usage && (
                <div className="border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-900">Usage:</span>
                  <span className="ml-2 text-gray-600">
                    {product.specifications.usage}
                  </span>
                </div>
              )}
              <div className="border-b border-gray-200 pb-3">
                <span className="font-semibold text-gray-900">Category:</span>
                <span className="ml-2 text-gray-600">{category?.label}</span>
              </div>
              {product.subcategory && (
                <div className="border-b border-gray-200 pb-3">
                  <span className="font-semibold text-gray-900">
                    Subcategory:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {product.subcategory}
                  </span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="py-8">
            <div className="text-center py-12 text-gray-500">
              <p>No reviews yet. Be the first to review this product!</p>
              <Button className="mt-4 bg-amber-600 hover:bg-amber-700">
                Write a Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
