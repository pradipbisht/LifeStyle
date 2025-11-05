"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Heart, Gift, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" asChild>
          <Link href="/dashboard/orders/track">
            <Package className="mr-2 h-4 w-4" />
            Track Orders
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/dashboard/wishlist">
            <Heart className="mr-2 h-4 w-4" />
            View Wishlist
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/dashboard/rewards">
            <Gift className="mr-2 h-4 w-4" />
            Redeem Points
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/shop">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
