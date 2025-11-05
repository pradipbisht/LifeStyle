import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title = "LifeStyle Hub - Your Ultimate Wellness & Lifestyle Companion",
  description = "Discover expert wellness advice, premium health products, and lifestyle tips. Your trusted source for health, skincare, haircare, pet care & parenting guidance. Shop quality products and read expert blogs.",
  keywords = "wellness, health tips, skincare, haircare, pet care, parenting, lifestyle, natural products, beauty, organic products, health blog, lifestyle blog",
  image = "/images/og-lifestyle-hub.jpg",
  url = "",
  type = "website",
  siteName = "LifeStyle Hub",
  author = "LifeStyle Hub Team",
  publishedTime,
  modifiedTime,
  category,
  tags = [],
}: SEOProps): Metadata {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifestylehub.com";
  const currentUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  // Combine keywords with tags
  const allKeywords = [...keywords.split(", "), ...tags].join(", ");

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: type as any,
      locale: "en_US",
      url: currentUrl,
      title,
      description,
      siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" &&
        publishedTime && {
          publishedTime,
          ...(modifiedTime && { modifiedTime }),
          ...(category && { section: category }),
          ...(tags.length > 0 && { tags }),
        }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@lifestylehub",
      site: "@lifestylehub",
    },
    alternates: {
      canonical: currentUrl,
    },
    other: {
      "theme-color": "#059669",
      "msapplication-TileColor": "#059669",
      "application-name": siteName,
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
  };
}

// Common metadata for different page types
export const homePageMetadata = generateSEOMetadata({
  title: "LifeStyle Hub - Your Ultimate Wellness & Lifestyle Companion",
  description:
    "Discover expert wellness advice, premium health products, and lifestyle tips. Your trusted source for health, skincare, haircare, pet care & parenting guidance.",
  keywords:
    "wellness hub, lifestyle blog, health products, skincare, haircare, pet care, parenting tips, natural products, organic beauty",
  url: "/",
});

export const blogPageMetadata = generateSEOMetadata({
  title: "Health & Wellness Blog | Expert Tips & Advice - LifeStyle Hub",
  description:
    "Read expert articles on health, wellness, beauty, and lifestyle. Get tips on skincare, haircare, parenting, pet care, and more from our wellness experts.",
  keywords:
    "health blog, wellness blog, skincare tips, haircare advice, parenting guide, pet care tips, lifestyle articles",
  url: "/blogs",
  type: "website",
});

export const shopPageMetadata = generateSEOMetadata({
  title: "Premium Wellness & Beauty Products - LifeStyle Hub Shop",
  description:
    "Shop high-quality wellness, health, and beauty products. Discover skincare, haircare, supplements, and lifestyle products carefully curated for your wellbeing.",
  keywords:
    "wellness products, beauty products, skincare products, haircare products, health supplements, organic products, natural beauty",
  url: "/shop",
  type: "website",
});

export const contactPageMetadata = generateSEOMetadata({
  title: "Contact Us - LifeStyle Hub | Get in Touch",
  description:
    "Contact LifeStyle Hub for wellness advice, product inquiries, or partnership opportunities. We're here to help you on your wellness journey.",
  keywords:
    "contact lifestyle hub, wellness consultation, product inquiry, customer service",
  url: "/contact",
});
