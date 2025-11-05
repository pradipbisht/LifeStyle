"use client";

import Script from "next/script";

export function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Event tracking functions
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Common tracking events
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = "USD"
) => {
  trackEvent("purchase", "ecommerce", transactionId, value);
};

export const trackAddToCart = (
  itemId: string,
  itemName: string,
  value: number
) => {
  trackEvent("add_to_cart", "ecommerce", `${itemId}-${itemName}`, value);
};

export const trackViewContent = (contentType: string, contentId: string) => {
  trackEvent("view_content", "content", `${contentType}-${contentId}`);
};

export const trackSearch = (searchTerm: string) => {
  trackEvent("search", "content", searchTerm);
};

export const trackNewsletterSignup = () => {
  trackEvent("newsletter_signup", "engagement");
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
