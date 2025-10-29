"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

function NavbarLogo() {
  const { isAuthenticated } = useAuth();
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  // Move navigation out of setState to avoid "setState in render" warnings.
  useEffect(() => {
    if (clickCount === 1) {
      // microtask to avoid running during render
      const id = setTimeout(() => router.push("/"), 0);
      return () => clearTimeout(id);
    }

    if (!isAuthenticated && clickCount === 5) {
      const id = setTimeout(() => router.push("/auth/login"), 0);
      return () => clearTimeout(id);
    } else if (isAuthenticated && clickCount === 5) {
      const id = setTimeout(() => router.push("/profile"), 0);
      return () => clearTimeout(id);
    }
  }, [clickCount, router]);

  const handleClick = () => setClickCount((prev) => prev + 1);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go to login (5 clicks)"
      className="group cursor-pointer text-3xl font-semibold tracking-tight transition-all hover:scale-[1.03]">
      <span className="text-primary transition-colors group-hover:text-primary/90">
        Life
      </span>
      <span className="text-black/80 dark:text-white">Style</span>
    </button>
  );
}

export default NavbarLogo;
