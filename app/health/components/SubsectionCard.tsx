"use client";

import { motion } from "framer-motion";
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
  color: string; // gradient or accent color (for hover/glow)
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
    <motion.div
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}>
      <Card
        className={`relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group transition-all duration-300`}>
        {/* Soft Glow Background on Hover */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />

        <CardHeader className="relative z-10">
          <div
            className={`h-14 w-14 rounded-xl ${iconBg} flex items-center justify-center mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon className="h-7 w-7 text-white" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
            {title}
          </CardTitle>

          <CardDescription className="text-gray-600 text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <Link href={href}>
            <Button
              variant="outline"
              className="w-full justify-between border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-black transition-all font-medium">
              Explore {title}
              <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                →
              </motion.span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
