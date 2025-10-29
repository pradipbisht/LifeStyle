"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, BookOpen, HelpCircle } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const wellnessItems: { title: string; href: string; description: string }[] = [
  {
    title: "✨ Skincare Hub",
    href: "/skincare",
    description: "Expert skincare advice and personalized routines.",
  },
  {
    title: "💇 Haircare Hub",
    href: "/haircare",
    description: "Professional tips for healthy, beautiful hair.",
  },
  {
    title: "🐾 Pet Care Hub",
    href: "/pets",
    description: "Everything you need for happy, healthy pets.",
  },
  {
    title: "👶 Parenting Hub",
    href: "/parenting",
    description: "Expert guidance for new parents and families.",
  },
  {
    title: "🏃 Fitness & Nutrition",
    href: "/fitness",
    description: "Your guide to a healthier lifestyle.",
  },
  {
    title: "Health & Wellness Hub",
    href: "/health",
    description: "Comprehensive resources for your overall well-being.",
  },
];

const shopItems: { title: string; href: string; description: string }[] = [
  {
    title: "🛍 Marketplace",
    href: "/shop",
    description: "Curated products from all wellness categories.",
  },
  {
    title: "Skincare Products",
    href: "/shop?category=skincare",
    description: "Expert-approved skincare essentials.",
  },
  {
    title: "Hair Care Products",
    href: "/shop?category=haircare",
    description: "Professional hair care solutions.",
  },
  {
    title: "Pet Supplies",
    href: "/shop?category=pets",
    description: "Quality products for your furry friends.",
  },
  {
    title: "Baby Products",
    href: "/shop?category=baby",
    description: "Safe, trusted products for babies.",
  },
];

const contentItems: { title: string; href: string; description: string }[] = [
  {
    title: "� AI Chat Assistant",
    href: "/chat",
    description: "Talk to our smart AI assistant for personalized advice.",
  },
  {
    title: "� Blog & Articles",
    href: "/blogs",
    description: "Wellness tips, health advice, and lifestyle insights.",
  },
  {
    title: "🧠 AI Tools",
    href: "/tools",
    description: "Interactive AI-powered wellness tools.",
  },
  {
    title: "Skincare Quiz",
    href: "/skincare/quiz",
    description: "Find your perfect skincare routine.",
  },
  {
    title: "Hair Type Quiz",
    href: "/haircare/hair-type-quiz",
    description: "Identify your hair type for personalized care.",
  },
  {
    title: "Pet Food Recommender",
    href: "/pets/nutrition-quiz",
    description: "Find the right food for your pet's needs.",
  },
  {
    title: "Baby Growth Tracker",
    href: "/parenting/growth-tracker",
    description: "Monitor your baby's development milestones.",
  },
];

const supportItems: { title: string; href: string; description: string }[] = [
  // {
  //   title: "👥 Community",
  //   href: "/community",
  //   description: "Connect with wellness enthusiasts and experts.",
  // },
  {
    title: "About Us",
    href: "/about",
    description: "Our mission, vision, and expert team.",
  },
  {
    title: "Contact Support",
    href: "/contact",
    description: "Get help from our wellness experts.",
  },
  {
    title: "FAQ",
    href: "/faq",
    description: "Quick answers to common questions.",
  },
  //   {
  //     title: "Privacy Policy",
  //     href: "/privacy",
  //     description: "How we protect your personal information.",
  //   },
  //   {
  //     title: "Terms of Service",
  //     href: "/terms",
  //     description: "Platform usage terms and conditions.",
  //   },
];

export function NavMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">🏠 Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/chat">💬 AI Chat</Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}

        <NavigationMenuItem>
          <NavigationMenuTrigger>🌟 Wellness</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] p-4">
              {wellnessItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" />
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] p-4">
              {shopItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Content & Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] p-4">
              {contentItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            Support
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] p-4">
              {supportItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
