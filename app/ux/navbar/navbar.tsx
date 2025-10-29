"use client";

import NavbarLogo from "./NavbarLogo";
import NavDropDown from "./NavDropDown";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { Separator } from "@/components/ui/separator";
import NavMobileMenu from "./NavMobMenu";
import { NavMenu } from "./NavMenu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  const { isAuthenticated, loading } = useAuth();
  const { cartCount } = useCart();
  if (loading) return null;

  return (
    <nav className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center px-4">
        {/* Left Section — Logo */}
        <div className="flex items-center space-x-4">
          <NavbarLogo />
          <Separator orientation="vertical" className="h-6" />
        </div>

        {/* Center Section — Desktop Nav Menu (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavMenu />
        </div>

        {/* Right Section — Auth Buttons or Profile */}
        <div className="ml-auto flex items-center space-x-2">
          {/* Cart Icon */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <NavDropDown />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu (visible only on small screens) */}
          <div className="md:hidden">
            <NavMobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
