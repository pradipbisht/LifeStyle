"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { sampleProducts } from "@/lib/sample-products";
import { sampleProducts2 } from "@/lib/sample-products-2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Upload, Package } from "lucide-react";
import AdminLayout from "../../AdminLayout";
// import AdminLayout from "../AdminLayout";

export default function ImportSampleProductsPage() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [selectedSet, setSelectedSet] = useState<1 | 2>(1);

  const currentProducts = selectedSet === 1 ? sampleProducts : sampleProducts2;

  const handleImport = async () => {
    setImporting(true);
    setProgress(0);
    setImported(0);
    setErrors([]);
    setSuccess(false);

    const total = currentProducts.length;

    for (let i = 0; i < currentProducts.length; i++) {
      try {
        const product = currentProducts[i];

        await addDoc(collection(db, "products"), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setImported((prev) => prev + 1);
        setProgress(Math.round(((i + 1) / total) * 100));
      } catch (error: any) {
        console.error("Error importing product:", error);
        setErrors((prev) => [
          ...prev,
          `Failed to import: ${currentProducts[i].name}`,
        ]);
      }
    }

    setImporting(false);
    setSuccess(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import Sample Products
          </h1>
          <p className="text-gray-600">
            Choose a product set and add {currentProducts.length} sample
            products to your database
          </p>
        </div>

        <Card className="p-8">
          {/* Product Set Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Product Set:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedSet(1)}
                disabled={importing}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedSet === 1
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Product Set 1</h3>
                  {selectedSet === 1 && (
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Original collection of health, skincare, haircare, pet, and
                  parenting products
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Multivitamin, Omega-3, Probiotics</li>
                  <li>• Vitamin C Serum, Moisturizer</li>
                  <li>• Argan Oil, Biotin Shampoo</li>
                  <li>• Pet shampoo, treats, toys</li>
                  <li>• Baby care essentials</li>
                </ul>
              </button>

              <button
                onClick={() => setSelectedSet(2)}
                disabled={importing}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedSet === 2
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Product Set 2</h3>
                  {selectedSet === 2 && (
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  New collection with different brands and product types
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Collagen, Ashwagandha, ACV Gummies</li>
                  <li>• Retinol Cream, Niacinamide Serum</li>
                  <li>• Keratin Mask, Rosemary Oil</li>
                  <li>• Dental sticks, laser toy, fish oil</li>
                  <li>• Food maker, teething toys, cards</li>
                </ul>
              </button>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              What will be imported (Set {selectedSet}):
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-3xl font-bold text-amber-600">
                  {
                    currentProducts.filter((p) => p.category === "health")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Health Products</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {
                    currentProducts.filter((p) => p.category === "skincare")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Skincare Products</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {
                    currentProducts.filter((p) => p.category === "haircare")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Haircare Products</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {currentProducts.filter((p) => p.category === "pets").length}
                </p>
                <p className="text-sm text-gray-600">Pet Care Products</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-3xl font-bold text-pink-600">
                  {
                    currentProducts.filter((p) => p.category === "parenting")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Parenting Products</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  {currentProducts.length}
                </p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Features included:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ High-quality product images from Unsplash</li>
                <li>✓ Detailed descriptions and specifications</li>
                <li>✓ Mix of direct sale and affiliate products</li>
                <li>✓ Featured and new product tags</li>
                <li>✓ Realistic pricing and stock levels</li>
                <li>✓ Customer ratings and reviews</li>
              </ul>
            </div>
          </div>

          {/* Import Progress */}
          {importing && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Importing Set {selectedSet}...
                </span>
                <span className="text-sm text-gray-600">
                  {imported} / {currentProducts.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">
                  Product Set {selectedSet} Imported Successfully!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {imported} products have been added to your database.
                </p>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="font-semibold text-red-900">
                  Some products failed to import:
                </p>
              </div>
              <ul className="text-sm text-red-700 ml-8 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleImport}
              disabled={importing}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 flex-1">
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Import Set {selectedSet} ({currentProducts.length} Products)
                </>
              )}
            </Button>

            {success && (
              <Button
                onClick={() => (window.location.href = "/admin/products")}
                size="lg"
                variant="outline">
                View Products
              </Button>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Each import will add{" "}
              {currentProducts.length} new products to your database. You can
              switch between sets and import both to have 30 total products.
              Delete unwanted products later from the Products page.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
