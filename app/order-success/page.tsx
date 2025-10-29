"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, Home } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-600 mb-8">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">
                  What&apos;s Next?
                </h3>
              </div>
              <p className="text-sm text-amber-800">
                Your order is being processed. You&apos;ll receive tracking
                information once your order ships.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
