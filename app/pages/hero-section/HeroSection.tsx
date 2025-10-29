"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import ImageSlider from "./ImageSlider";
import CategoryGrid from "./categories";
import { Playfair_Display } from "next/font/google";
import { useState, useEffect } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export default function HeroSection() {
  // Generate bubbles on client-side only to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [bubbles, setBubbles] = useState<
    Array<{
      width: number;
      height: number;
      left: number;
      top: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setMounted(true);
    // Only generate bubbles on client-side
    setBubbles(
      [...Array(15)].map(() => ({
        width: Math.random() * 60 + 20,
        height: Math.random() * 60 + 20,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-50/30 via-white to-blue-50/50">
      {/* Animated Bubbles Background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        suppressHydrationWarning>
        {mounted &&
          bubbles.map((bubble, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-black/5"
              style={{
                width: `${bubble.width}px`,
                height: `${bubble.height}px`,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                animation: `float ${bubble.duration}s ease-in-out infinite`,
                animationDelay: `${bubble.delay}s`,
              }}
            />
          ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-h-[500px] lg:max-h-[450px]">
          {/* Left Side - Text Content */}
          <div className="space-y-4 order-2 lg:order-1">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 border-blue-200 animate-pulse">
              <Sparkles className="h-3 w-3" />
              Your Journey to Wellness Starts Here
            </Badge>

            <h1
              className={`${playfair.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]`}>
              <span className="inline-block animate-bounce-subtle bg-linear-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Wellness
              </span>
              <br />
              <span className="inline-block animate-bounce-subtle-delay bg-linear-to-r from-pink-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                & Lifestyle
              </span>
              <br />
              <span className="inline-block animate-bounce-subtle-delay-2 text-gray-800">
                Hub
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl animate-fade-in">
              Discover expert tips, personalized recommendations, and trusted
              advice for every aspect of your life.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up">
              <Button
                size="default"
                className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                Explore Health & Wellness
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300">
                Browse Products
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2 animate-fade-in-up">
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                  500+
                </div>
                <div className="text-xs text-gray-600">Expert Articles</div>
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                  50K+
                </div>
                <div className="text-xs text-gray-600">Happy Readers</div>
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                  100+
                </div>
                <div className="text-xs text-gray-600">Products</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div className="order-1 lg:order-2 animate-fade-in-right h-[300px] lg:h-[400px]">
            <ImageSlider />
          </div>
        </div>

        <CategoryGrid />
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-15px, -10px) scale(0.9);
          }
          75% {
            transform: translate(20px, 15px) scale(1.05);
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .animate-bounce-subtle-delay {
          animation: bounce-subtle 3s ease-in-out infinite 0.2s;
        }

        .animate-bounce-subtle-delay-2 {
          animation: bounce-subtle 3s ease-in-out infinite 0.4s;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out 0.2s both;
        }
      `}</style>
    </section>
  );
}
