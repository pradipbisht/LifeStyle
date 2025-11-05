import { Package } from "lucide-react";
import { Product } from "@/lib/types/shop";

interface ProductStockStatusProps {
  product: Product;
}

export default function ProductStockStatus({
  product,
}: ProductStockStatusProps) {
  return (
    <div className="flex items-center gap-3">
      {product.inStock ? (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
          <Package className="w-5 h-5" />
          <span className="font-medium">In Stock</span>
          {product.saleType === "direct" && product.stock && (
            <span className="text-green-500">({product.stock} available)</span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
          <Package className="w-5 h-5" />
          <span className="font-medium">Out of Stock</span>
        </div>
      )}
    </div>
  );
}
