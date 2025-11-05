import { generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Pet Care Tips & Products | Expert Pet Health Guide - LifeStyle Hub",
  description:
    "Discover expert pet care advice, health tips for pets, premium pet products, and comprehensive guides for pet wellness and happiness.",
  keywords:
    "pet care, pet health, pet tips, pet products, animal care, pet wellness, pet advice, dog care, cat care, pet nutrition",
  url: "/pets",
  category: "pets",
});

export default function PetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
