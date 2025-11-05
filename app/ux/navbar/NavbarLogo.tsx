"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { LogoWithText } from "@/components/ui/logo";

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
  }, [clickCount, router, isAuthenticated]);

  const handleClick = () => setClickCount((prev) => prev + 1);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <LogoWithText
        size="md"
        className="hover:scale-105 transition-transform"
      />
    </div>
  );
}

export default NavbarLogo;
