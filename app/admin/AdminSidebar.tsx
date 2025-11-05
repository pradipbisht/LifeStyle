"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ChevronRight,
  Home,
  ShoppingBag,
  BarChart3,
  Upload,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Quick Access",
    items: [
      {
        title: "Users",
        icon: Users,
        href: "/admin/users",
      },
      {
        title: "Blogs",
        icon: FileText,
        href: "/admin/blogs",
      },
      {
        title: "Contacts",
        icon: Users,
        href: "/admin/contacts",
      },
    ],
  },
  {
    title: "Shop Management",
    items: [
      {
        title: "Products",
        icon: ShoppingBag,
        href: "/admin/products",
      },
      {
        title: "Import Sample Products",
        icon: Upload,
        href: "/admin/products/import",
      },
      {
        title: "Analytics",
        icon: BarChart3,
        href: "/admin/analytics",
      },
      {
        title: "Email Campaigns",
        icon: FileText,
        href: "/admin/email-campaigns",
      },
    ],
  },
  {
    title: "Getting Started",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-gray-500">Wellness Hub</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Back to Main Site */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Back to Main Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4" />

        {/* Menu Items */}
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {isActive && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userProfile?.profilePic} />
            <AvatarFallback className="bg-blue-600 text-white">
              {userProfile?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {userProfile?.username}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userProfile?.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
