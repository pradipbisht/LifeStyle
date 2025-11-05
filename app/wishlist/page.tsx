"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Filter,
  SortAsc,
  Trash2,
  ShoppingCart,
  TrendingUp,
  Package,
  BookOpen,
} from "lucide-react";
// import DashboardLayout from "../user-dashboard/DashboardLayout";
import { useWishlistContext } from "@/components/context/WishlistContext";
import { useAuth } from "@/components/context/AuthContext";
import WishlistGrid from "./components/WishlistGrid";
import EmptyWishlist from "./components/EmptyWishlist";
import DashboardLayout from "../dashboard/user-dashboard/DashboardLayout";

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlistItems, wishlistCount, loading, clearWishlist } =
    useWishlistContext();

  const [filter, setFilter] = useState<"all" | "product" | "blog">("all");
  const [clearingAll, setClearingAll] = useState(false);

  // Filter items
  const filteredItems = wishlistItems.filter((item) => {
    if (filter === "all") return true;
    return item.productType === filter;
  });

  // Get stats
  const productItems = wishlistItems.filter(
    (item) => item.productType === "product"
  );
  const blogItems = wishlistItems.filter((item) => item.productType === "blog");
  const totalValue = productItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  // Handle clear all
  const handleClearAll = async () => {
    if (
      !confirm("Are you sure you want to remove all items from your wishlist?")
    ) {
      return;
    }

    try {
      setClearingAll(true);
      await clearWishlist();
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    } finally {
      setClearingAll(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout user={{ name: "Guest", email: "", avatar: "" }}>
        <div className="p-6">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to view your wishlist
            </h2>
            <p className="text-gray-600">
              Create an account to save your favorite items
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{
        name: user.displayName || "User",
        email: user.email || "",
        avatar: user.photoURL || "",
      }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-1">
              {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved for
              later
            </p>
          </div>

          {wishlistCount > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={clearingAll}
              className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              {clearingAll ? "Clearing..." : "Clear All"}
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        {wishlistCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productItems.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Blogs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogItems.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${totalValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Content */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All ({wishlistCount})</TabsTrigger>
              <TabsTrigger value="product">
                Products ({productItems.length})
              </TabsTrigger>
              <TabsTrigger value="blog">Blogs ({blogItems.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6">
            {filteredItems.length === 0 && !loading ? (
              <EmptyWishlist />
            ) : (
              <WishlistGrid items={filteredItems} loading={loading} />
            )}
          </TabsContent>

          <TabsContent value="product" className="mt-6">
            {productItems.length === 0 && !loading ? (
              <EmptyWishlist />
            ) : (
              <WishlistGrid items={productItems} loading={loading} />
            )}
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            {blogItems.length === 0 && !loading ? (
              <EmptyWishlist />
            ) : (
              <WishlistGrid items={blogItems} loading={loading} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
