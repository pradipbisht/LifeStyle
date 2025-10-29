"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <section className="relative overflow-hidden bg-linear-to-br from-blue-50/30 via-white to-blue-50/50 py-20 md:py-28">
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
      <section className="py-20 bg-white">
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

      {/* Story Section */}
      <section className="py-20 bg-linear-to-br from-blue-50/30 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12`}>
            Our Story
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Story Text */}
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded with a passion for holistic wellness, our platform has
                grown from a simple blog into a comprehensive resource for
                health, beauty, and lifestyle enthusiasts.
              </p>
              <p>
                We believe that wellness is not one-size-fits-all. That's why we
                offer personalized recommendations, expert-backed articles, and
                a curated marketplace to help you find exactly what you need.
              </p>
              <p>
                Our team of wellness experts, writers, and health enthusiasts
                work tirelessly to bring you the latest trends, proven tips, and
                trusted product recommendations.
              </p>
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
