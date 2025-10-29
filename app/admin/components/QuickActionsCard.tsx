import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, ShoppingBag, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function QuickActionsCard() {
  const quickActions = [
    {
      href: "/admin/users",
      icon: Users,
      label: "Manage Users",
      color: "text-blue-600",
      hoverBorder: "hover:border-blue-300",
    },
    {
      href: "/admin/blogs",
      icon: FileText,
      label: "Manage Blogs",
      color: "text-green-600",
      hoverBorder: "hover:border-green-300",
    },
    {
      href: "/admin/products",
      icon: ShoppingBag,
      label: "Manage Products",
      color: "text-amber-600",
      hoverBorder: "hover:border-amber-300",
    },
    {
      href: "/admin/contacts",
      icon: MessageSquare,
      label: "View Messages",
      color: "text-purple-600",
      hoverBorder: "hover:border-purple-300",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <button
                className={`w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 ${action.hoverBorder} transition-all text-left group`}>
                <action.icon
                  className={`h-5 w-5 ${action.color} mb-2 group-hover:scale-110 transition-transform`}
                />
                <p className="text-sm font-medium">{action.label}</p>
              </button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
