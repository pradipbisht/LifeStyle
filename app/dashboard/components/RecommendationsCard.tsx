"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Recommendation } from "@/app/types/user-dashboard";

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

export default function RecommendationsCard({
  recommendations,
}: RecommendationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recommended for You
          <Button variant="outline" size="sm" asChild>
            <Link href="/shop">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="group border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    (e.currentTarget
                      .nextElementSibling as HTMLElement)!.style.display =
                      "flex";
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              </div>
              <h3 className="font-medium text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {product.reason}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">${product.price}</span>
                <Button size="sm">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
