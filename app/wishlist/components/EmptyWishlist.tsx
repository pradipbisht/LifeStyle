"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, BookOpen } from "lucide-react";
import Link from "next/link";

export default function EmptyWishlist() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs">0</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>

          <p className="text-gray-600 mb-8">
            Start adding products and blogs you love to your wishlist. They'll
            appear here for easy access later!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/shop" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/blogs" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Read Blogs
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p className="mb-2">
              💡 <strong>Tip:</strong> Click the heart icon on any product or
              blog to add it to your wishlist
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
