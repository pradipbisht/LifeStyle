"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types/shop";
import { CURRENCY_SYMBOLS } from "@/lib/shop-constants";
import { ShoppingCart, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-green-600 text-white">NEW</Badge>
            )}
            {discountPercent > 0 && (
              <Badge className="bg-red-600 text-white">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.isExpertChoice && (
              <Badge className="bg-amber-600 text-white">Expert's Choice</Badge>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/shop/${product.slug}`}>
              <CardTitle className="text-lg line-clamp-2 group-hover:text-amber-600 transition-colors">
                {product.name}
              </CardTitle>
            </Link>
            <CardDescription className="text-sm mt-1">
              {product.brand}
            </CardDescription>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {CURRENCY_SYMBOLS[product.currency]}
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {CURRENCY_SYMBOLS[product.currency]}
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        {product.saleType === "affiliate" ? (
          <Button
            asChild
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={!product.inStock}>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Buy Now
            </a>
          </Button>
        ) : (
          <Button
            onClick={() => onAddToCart?.(product)}
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={!product.inStock}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
