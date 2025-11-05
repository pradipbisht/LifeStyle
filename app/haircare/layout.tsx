import { generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Haircare Products & Tips | Expert Hair Health Guide - LifeStyle Hub",
  description:
    "Explore premium haircare products and expert tips for healthy, beautiful hair. Learn about natural hair treatments, styling tips, and hair care routines.",
  keywords:
    "haircare, hair care, hair products, natural haircare, hair health, hair treatments, hair styling, healthy hair, hair tips",
  url: "/haircare",
  category: "haircare",
});

export default function HaircareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
