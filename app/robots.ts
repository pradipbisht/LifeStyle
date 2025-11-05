import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifestylehub.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/*",
          "/dashboard/*",
          "/api/*",
          "/auth/signup",
          "/auth/login",
          "/_next/",
          "/checkout/",
          "/cart/",
          "/wishlist/",
          "/order-success/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/*",
          "/dashboard/*",
          "/api/*",
          "/auth/*",
          "/_next/",
          "/checkout/",
          "/cart/",
          "/wishlist/",
          "/order-success/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
