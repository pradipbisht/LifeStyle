import { generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Health & Wellness Tips | Expert Health Advice - LifeStyle Hub",
  description:
    "Get expert health and wellness advice, tips for healthy living, nutrition guidance, and wellness products. Your comprehensive guide to better health.",
  keywords:
    "health tips, wellness, healthy living, nutrition, health advice, wellness tips, healthy lifestyle, preventive health, wellbeing",
  url: "/health",
  category: "health",
});

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
