import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types/shop";
import { CURRENCY_SYMBOLS } from "@/lib/shop-constants";

interface ProductPriceCardProps {
  product: Product;
}

export default function ProductPriceCard({ product }: ProductPriceCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl font-bold text-slate-900">
          {CURRENCY_SYMBOLS[product.currency]}
          {product.price}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-slate-500 line-through">
              {CURRENCY_SYMBOLS[product.currency]}
              {product.originalPrice}
            </span>
            <Badge className="bg-red-100 text-red-700 text-sm font-semibold">
              Save {discount}%
            </Badge>
          </>
        )}
      </div>
      {product.saleType === "affiliate" && product.affiliateProvider && (
        <p className="text-sm text-slate-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
          <span className="font-medium">Available on:</span>{" "}
          {product.affiliateProvider.charAt(0).toUpperCase() +
            product.affiliateProvider.slice(1)}
        </p>
      )}
    </div>
  );
}
