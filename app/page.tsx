import React from "react";
import HeroSection from "./pages/hero-section/HeroSection";
import AboutPage from "./about/page";
import Footer from "./ux/footer/footer";
import TopProduct from "./ux/products/TopProduct";
import LatestBlogs from "@/components/singleblogs/LatestBlogs";
// import ChromaGridWrapper from "./ux/products/NewTopProduct";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutPage />
      <TopProduct />
      {/* <ChromaGridWrapper /> */}
      <LatestBlogs />
      <Footer />
    </main>
  );
}
