"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  User,
  ShoppingBag,
  Heart,
  Gift,
  Star,
  RefreshCw,
  MessageCircle,
  Settings,
  LogOut,
  ShoppingCart,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useWishlistContext } from "@/components/context/WishlistContext";

interface UserSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function UserSidebar({ user, ...props }: UserSidebarProps) {
  const pathname = usePathname();
  const { wishlistCount } = useWishlistContext();

  // Update navigation data with real wishlist count
  const navigationData = {
    main: [
      {
        title: "Dashboard",
        icon: Home,
        url: "/dashboard",
        description: "Overview & recent activity",
      },
      {
        title: "My Profile",
        icon: User,
        url: "/dashboard/profile",
        description: "Personal information & preferences",
      },
      {
        title: "Orders",
        icon: ShoppingBag,
        url: "/dashboard/orders",
        badge: "2",
        badgeVariant: "secondary" as const,
        description: "Order history & tracking",
        subItems: [
          { title: "All Orders", url: "/dashboard/orders" },
          { title: "Track Orders", url: "/dashboard/orders/track" },
          { title: "Returns", url: "/dashboard/orders/returns" },
        ],
      },
      {
        title: "Wishlist",
        icon: Heart,
        url: "/dashboard/wishlist",
        badge: wishlistCount > 0 ? wishlistCount.toString() : undefined,
        badgeVariant: "outline" as const,
        description: "Saved products & favorites",
      },
      {
        title: "Rewards",
        icon: Gift,
        url: "/dashboard/rewards",
        badge: "850 pts",
        badgeVariant: "default" as const,
        description: "Loyalty points & benefits",
        subItems: [
          { title: "Points Balance", url: "/dashboard/rewards" },
          { title: "Redeem Rewards", url: "/dashboard/rewards/redeem" },
          { title: "Referrals", url: "/dashboard/rewards/referrals" },
        ],
      },
    ],
    secondary: [
      {
        title: "My Reviews",
        icon: Star,
        url: "/dashboard/reviews",
      },
      {
        title: "Subscriptions",
        icon: RefreshCw,
        url: "/dashboard/subscriptions",
        badge: "Active",
        badgeVariant: "default" as const,
      },
      {
        title: "Help & Support",
        icon: MessageCircle,
        url: "/dashboard/support",
      },
    ],
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">LifeStyle</span>
                  <span className="text-xs text-sidebar-foreground/70">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.description}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}>
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.secondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/shop">
                    <ShoppingCart className="size-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/notifications">
                    <Bell className="size-4" />
                    <span>Notifications</span>
                    <Badge variant="destructive" className="ml-auto text-xs">
                      3
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button>
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
