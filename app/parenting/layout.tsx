import { generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Parenting Tips & Advice | Expert Parenting Guide - LifeStyle Hub",
  description:
    "Get expert parenting advice, tips for child development, family wellness, and parenting products. Comprehensive guides for modern parents.",
  keywords:
    "parenting tips, child development, parenting advice, family wellness, parenting guide, child care, family health, parenting products",
  url: "/parenting",
  category: "parenting",
});

export default function ParentingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
