"use client";

import AdminLayout from "../AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function LikesPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1
            className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
            Likes & Reactions
          </h1>
          <p className="text-gray-600">
            View and analyze user engagement metrics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Likes & Reactions
            </CardTitle>
            <CardDescription>
              Coming soon - Engagement analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-gray-400">
            <p>Likes and reactions analytics will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
