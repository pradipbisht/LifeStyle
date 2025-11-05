import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Heart, Share2 } from "lucide-react";
import { Product } from "@/lib/types/shop";
import { CURRENCY_SYMBOLS } from "@/lib/shop-constants";

interface ProductActionsProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onBuyNow: () => void;
}

export default function ProductActions({
  product,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector (for direct sales only) */}
      {product.saleType === "direct" && product.inStock && (
        <div className="flex items-center gap-4">
          <span className="text-slate-700 font-medium">Quantity:</span>
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 hover:bg-slate-100 transition-colors text-slate-600 font-medium">
              -
            </button>
            <span className="px-6 py-3 border-x border-slate-300 bg-white font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 hover:bg-slate-100 transition-colors text-slate-600 font-medium">
              +
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {product.saleType === "direct" ? (
          <>
            <Button
              onClick={onBuyNow}
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled={!product.inStock}>
              Buy Now - {CURRENCY_SYMBOLS[product.currency]}
              {product.price * quantity}
            </Button>
            <Button
              onClick={handleAddToCart}
              size="lg"
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 text-lg font-semibold py-4 rounded-xl transition-all"
              disabled={!product.inStock}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </>
        ) : (
          <Button
            onClick={onBuyNow}
            size="lg"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <ExternalLink className="w-5 h-5 mr-2" />
            Buy on{" "}
            {product.affiliateProvider
              ? product.affiliateProvider.charAt(0).toUpperCase() +
                product.affiliateProvider.slice(1)
              : "Partner Site"}
          </Button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-slate-300 hover:bg-slate-50 py-3 rounded-xl">
            <Heart className="w-5 h-5 mr-2" />
            Wishlist
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-slate-300 hover:bg-slate-50 py-3 rounded-xl">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
