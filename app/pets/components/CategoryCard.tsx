"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconBg: string;
  href: string;
}

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  color,
  iconBg,
  href,
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card
        className={`group h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-linear-to-br ${color} cursor-pointer relative overflow-hidden`}>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-400/0 via-orange-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <CardHeader className="relative">
          <div
            className={`h-14 w-14 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-700 text-base">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <span className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 inline-flex items-center gap-1">
            Learn More
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
