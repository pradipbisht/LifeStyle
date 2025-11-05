"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Product } from "@/lib/types/shop";
import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, ExternalLink, Heart } from "lucide-react";
import { CURRENCY_SYMBOLS } from "@/lib/shop-constants";
import { toast } from "sonner";
import Link from "next/link";
import "./ProductChromeGrid.css";

export interface ProductChromeGridProps {
  products: Product[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  onAddToWishlist?: (product: Product) => void;
}

type SetterFn = (v: number | string) => void;

export const ProductChromeGrid: React.FC<ProductChromeGridProps> = ({
  products,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onAddToWishlist,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const { addToCart } = useCart();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  const getDiscountPercentage = (product: Product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };

  return (
    <div
      ref={rootRef}
      className={`product-chrome-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}>
      {products.map((product) => {
        const discount = getDiscountPercentage(product);
        return (
          <article
            key={product.id}
            className="product-chrome-card"
            onMouseMove={handleCardMove}
            style={
              {
                "--card-border": product.isFeatured ? "#f59e0b" : "#e5e7eb",
                "--card-gradient": `linear-gradient(145deg, ${
                  product.isFeatured
                    ? "rgba(245, 158, 11, 0.1)"
                    : "rgba(255, 255, 255, 0.95)"
                }, rgba(255, 255, 255, 0.9))`,
              } as React.CSSProperties
            }>
            {/* Product Image */}
            <Link
              href={`/shop/${product.id}`}
              className="product-image-wrapper">
              <div className="product-image-container">
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.name}
                  loading="lazy"
                />

                {/* Badges */}
                <div className="product-badges">
                  {product.isFeatured && (
                    <Badge className="bg-amber-500 text-white">Featured</Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white">New</Badge>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="product-wishlist-btn"
                  onClick={(e) => handleAddToWishlist(e, product)}>
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Link>

            {/* Product Info */}
            <div className="product-info">
              <Link href={`/shop/${product.id}`}>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
              </Link>

              {/* Rating */}
              <div className="product-rating">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="rating-value">{product.rating}</span>
                <span className="rating-count">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="product-price">
                <span className="current-price">
                  {CURRENCY_SYMBOLS[product.currency]}
                  {product.price}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="original-price">
                      {CURRENCY_SYMBOLS[product.currency]}
                      {product.originalPrice}
                    </span>
                  )}
              </div>

              {/* Actions */}
              <div className="product-actions">
                {product.saleType === "affiliate" ? (
                  <Button
                    asChild
                    size="sm"
                    className="product-action-btn affiliate-btn">
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Buy Now
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="product-action-btn cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}
              </div>
            </div>
          </article>
        );
      })}
      <div className="product-chrome-overlay" />
      <div ref={fadeRef} className="product-chrome-fade" />
    </div>
  );
};

export default ProductChromeGrid;
