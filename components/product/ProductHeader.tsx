import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/lib/types/shop";
import { CATEGORIES } from "@/lib/shop-constants";

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  const category = CATEGORIES.find((c) => c.value === product.category);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="mb-8">
      {/* Category & Brand */}
      <div className="flex items-center gap-3 mb-6">
        <Badge
          variant="secondary"
          className="bg-amber-500 text-white hover:bg-amber-600 px-4 py-1.5 text-sm font-medium">
          {category?.emoji} {category?.label}
        </Badge>
        {product.brand && (
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            by {product.brand}
          </span>
        )}
        {/* Additional Badges */}
        <div className="flex gap-2 ml-auto">
          {product.isFeatured && (
            <Badge className="bg-blue-500 text-white">Featured</Badge>
          )}
          {product.isNew && (
            <Badge className="bg-green-500 text-white">New</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-red-500 text-white">-{discount}%</Badge>
          )}
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(product.rating || 0)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          ))}
        </div>
        <span className="text-slate-600 font-medium">
          {(product.rating || 0).toFixed(1)}
        </span>
        <span className="text-slate-500">({product.reviews || 0} reviews)</span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-lg text-slate-600 mb-6 leading-relaxed font-light border-l-4 border-amber-500 pl-6 italic">
          {product.shortDescription}
        </p>
      )}
    </div>
  );
}
