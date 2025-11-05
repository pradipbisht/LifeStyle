import { generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title:
    "Natural Skincare Products & Tips | Expert Skincare Guide - LifeStyle Hub",
  description:
    "Discover premium skincare products and expert tips for healthy, glowing skin. Read about organic skincare routines, anti-aging solutions, and natural beauty treatments.",
  keywords:
    "skincare, natural skincare, organic skincare, skincare routine, anti-aging, beauty tips, skincare products, glowing skin, healthy skin",
  url: "/skincare",
  category: "skincare",
});

export default function SkincareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
