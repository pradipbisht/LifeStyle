"use client";

import AdminLayout from "../AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function CommentsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1
            className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
            Comments Management
          </h1>
          <p className="text-gray-600">Moderate and manage user comments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments
            </CardTitle>
            <CardDescription>
              Coming soon - Comment moderation tools
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-gray-400">
            <p>Comments management interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
