import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types/shop";
import { CATEGORIES } from "@/lib/shop-constants";

interface ProductDetailsTabsProps {
  product: Product;
}

export default function ProductDetailsTabs({
  product,
}: ProductDetailsTabsProps) {
  const category = CATEGORIES.find((c) => c.value === product.category);

  return (
    <div className="border-t border-slate-200">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent px-6 py-4 font-semibold">
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent px-6 py-4 font-semibold">
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent px-6 py-4 font-semibold">
            Reviews ({product.reviews || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-6 lg:p-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line mb-8">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Key Features
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <span className="text-amber-600 mt-1 text-lg">✓</span>
                      <span className="text-slate-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="p-6 lg:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 capitalize block mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span className="text-slate-600">{value}</span>
                  </div>
                )
            )}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">
                Category:
              </span>
              <span className="text-slate-600">{category?.label}</span>
            </div>
            {product.subcategory && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">
                  Subcategory:
                </span>
                <span className="text-slate-600">{product.subcategory}</span>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-6 lg:p-8">
          <div className="text-center py-12">
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 max-w-md mx-auto">
              <p className="text-slate-600 mb-4 text-lg">
                No reviews yet. Be the first to review this product!
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl">
                Write a Review
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
