"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Heart, Users, Target, Sparkles } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 text-blue-700 border-blue-200">
            <Sparkles className="h-4 w-4 mr-2" />
            About Us
          </Badge>
          <h1
            className={`${playfair.className} text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in`}>
            Your Wellness Journey
            <br />
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            We're dedicated to helping you live your best life through expert
            advice, personalized recommendations, and a supportive community.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-linear-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To empower individuals with knowledge and tools to achieve
                holistic wellness in every aspect of their lives.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-linear-to-br from-purple-50 to-white border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-14 w-14 rounded-full bg-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A world where everyone has access to trusted wellness
                information and products that enhance their quality of life.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-linear-to-br from-pink-50 to-white border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-14 w-14 rounded-full bg-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Community
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join 50,000+ readers who trust us for expert wellness advice and
                product recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
            Elevate your lifestyle with effortless elegance.
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
            <div className="relative mb-6 sm:mb-0">
              <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  className="hidden rounded-[15px] dark:block"
                  alt="payments illustration dark"
                  width={1207}
                  height={929}
                />
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  className="rounded-[15px] shadow dark:hidden"
                  alt="payments illustration light"
                  width={1207}
                  height={929}
                />
              </div>
            </div>

            <div className="relative space-y-4">
              <p className="text-muted-foreground">
                LifestyleSphere is evolving to be more than just a brand.{" "}
                <span className="text-accent-foreground font-bold">
                  It empowers a complete lifestyle ecosystem
                </span>{" "}
                — from curated collections to inspired living.
              </p>

              <p className="text-muted-foreground">
                It brings together e-commerce, affiliate opportunities, and
                creative storytelling — helping individuals and brands grow
                through style, wellness, and purpose.
              </p>

              <div className="pt-6">
                <blockquote className="border-l-4 pl-4">
                  <p>
                    Partnering with LifestyleSphere feels like joining a
                    movement that values authenticity and design. Every product
                    we promote connects us with an audience that truly cares
                    about quality living.
                  </p>

                  <div className="mt-6 space-y-3">
                    <cite className="block font-medium">
                      Ava Collins, Lifestyle Partner
                    </cite>
                    <img
                      className="h-5 w-fit dark:invert"
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                      alt="Amazon Logo"
                      height="20"
                      width="auto"
                    />
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </main>
  );
}
