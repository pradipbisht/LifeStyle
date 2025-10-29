"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SubsectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconBg: string;
  href: string;
}

export default function SubsectionCard({
  title,
  description,
  icon: Icon,
  color,
  iconBg,
  href,
}: SubsectionCardProps) {
  return (
    <Card
      className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-linear-to-br ${color} overflow-hidden relative`}>
      <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="relative z-10">
        <div
          className={`h-14 w-14 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>

        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </CardTitle>

        <CardDescription className="text-gray-700 text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <Link href={href}>
          <Button
            variant="ghost"
            className="w-full justify-between group-hover:bg-white/50 transition-colors text-gray-900 font-semibold">
            Learn More
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
