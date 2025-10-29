"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";

export default function NavMobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((s) => !s);

  const links = [
    { name: "Home", href: "/" },
    // { name: "AI Chat", href: "/chat" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="flex items-center">
      {/* Hamburger / X Icon */}
      <button
        onClick={toggleMenu}
        aria-label={open ? "Close menu" : "Open menu"}
        className="p-2 rounded-md hover:bg-accent transition">
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Animated Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={toggleMenu}
              aria-hidden
            />

            {/* Panel */}
            <div className="relative ml-auto w-full max-w-sm bg-popover text-popover-foreground p-6 pt-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Menu</h3>
                <button
                  onClick={toggleMenu}
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-accent transition">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-foreground hover:text-primary transition">
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Only show auth section if user is authenticated */}
              <MobileMenuAuth closeMenu={() => setOpen(false)} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenuAuth({ closeMenu }: { closeMenu: () => void }) {
  const { isAuthenticated, logout } = useAuth();

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="mt-6 border-t border-border pt-4">
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            onClick={closeMenu}
            className="block w-full text-center py-2 rounded-md border border-muted">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            onClick={closeMenu}
            className="block w-full text-center py-2 rounded-md bg-primary text-white font-medium">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  // Show account/logout if authenticated
  return (
    <div className="mt-6 border-t border-border pt-4">
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          onClick={closeMenu}
          className="block w-full text-center py-2 rounded-md bg-primary text-white font-medium">
          Dashboard
        </Link>
        <button
          onClick={() => {
            logout();
            closeMenu();
          }}
          className="w-full py-2 rounded-md border border-muted text-center">
          Log out
        </button>
      </div>
    </div>
  );
}
