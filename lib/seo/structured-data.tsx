import React from "react";

// JSON-LD Structured Data Components

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
  sameAs?: string[];
}

interface ArticleData {
  headline: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  category?: string;
  keywords?: string[];
}

interface ProductData {
  name: string;
  description: string;
  image: string[];
  brand: string;
  price: number;
  currency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  category: string;
  sku?: string;
  url: string;
  reviews?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface FAQData {
  question: string;
  answer: string;
}

interface BreadcrumbData {
  name: string;
  url: string;
}

// Organization Schema
export function OrganizationSchema({ data }: { data: OrganizationData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: {
      "@type": "ImageObject",
      url: data.logo,
    },
    description: data.description,
    ...(data.contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: data.contactPoint.telephone,
        contactType: data.contactPoint.contactType,
      },
    }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema
export function ArticleSchema({ data }: { data: ArticleData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    image: {
      "@type": "ImageObject",
      url: data.image,
    },
    author: {
      "@type": "Person",
      name: data.author,
    },
    publisher: {
      "@type": "Organization",
      name: "LifeStyle Hub",
      logo: {
        "@type": "ImageObject",
        url: "/images/logo.png",
      },
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    url: data.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    ...(data.category && { articleSection: data.category }),
    ...(data.keywords && { keywords: data.keywords.join(", ") }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product Schema
export function ProductSchema({ data }: { data: ProductData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image,
    brand: {
      "@type": "Brand",
      name: data.brand,
    },
    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: data.currency,
      availability: `https://schema.org/${data.availability}`,
      url: data.url,
    },
    category: data.category,
    ...(data.sku && { sku: data.sku }),
    ...(data.reviews && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.reviews.ratingValue,
        reviewCount: data.reviews.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
export function FAQSchema({ data }: { data: FAQData[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
export function BreadcrumbSchema({ data }: { data: BreadcrumbData[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: data.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LifeStyle Hub",
    url: "https://lifestylehub.com",
    description:
      "Your ultimate wellness and lifestyle companion featuring expert advice, premium products, and comprehensive guides for health, beauty, and wellbeing.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lifestylehub.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Default Organization Data
export const organizationData: OrganizationData = {
  name: "LifeStyle Hub",
  url: "https://lifestylehub.com",
  logo: "https://lifestylehub.com/images/logo.png",
  description:
    "Your trusted source for wellness, health, beauty, and lifestyle advice with premium products and expert guidance.",
  contactPoint: {
    telephone: "+1-800-LIFESTYLE",
    contactType: "Customer Service",
  },
  sameAs: [
    "https://facebook.com/lifestylehub",
    "https://twitter.com/lifestylehub",
    "https://instagram.com/lifestylehub",
    "https://linkedin.com/company/lifestylehub",
  ],
};
