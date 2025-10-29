"use client";

import { Product } from "@/lib/types/shop";
import { CATEGORIES, CURRENCY_SYMBOLS } from "@/lib/shop-constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductsTableProps {
  products: Product[];
  onDelete: (productId: string) => void;
}

export default function ProductsTable({
  products,
  onDelete,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No products found. Add your first product!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="outline">
                  {CATEGORIES.find((c) => c.value === product.category)?.emoji}{" "}
                  {product.category}
                </Badge>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-semibold">
                    {CURRENCY_SYMBOLS[product.currency]}
                    {product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      {CURRENCY_SYMBOLS[product.currency]}
                      {product.originalPrice}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  {product.isActive ? (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      Featured
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    product.saleType === "affiliate" ? "outline" : "default"
                  }>
                  {product.saleType === "affiliate" ? "Affiliate" : "Direct"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/products/${product.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href={`/shop/${product.slug}`} target="_blank">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
