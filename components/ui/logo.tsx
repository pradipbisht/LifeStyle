"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 40, height = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      {/* Outer Circle - represents wholeness and wellness */}
      <circle
        cx="60"
        cy="60"
        r="55"
        stroke="currentColor"
        strokeWidth="3"
        className="text-emerald-600"
        fill="none"
      />

      {/* Leaf elements - represents natural/organic */}
      <path
        d="M35 45C35 35 45 25 55 25C65 25 75 35 75 45C75 55 65 65 55 65C45 65 35 55 35 45Z"
        fill="currentColor"
        className="text-emerald-500"
      />
      <path
        d="M45 55C45 45 55 35 65 35C75 35 85 45 85 55C85 65 75 75 65 75C55 75 45 65 45 55Z"
        fill="currentColor"
        className="text-emerald-400"
      />

      {/* Heart shape in center - represents care and love */}
      <path
        d="M60 75C60 75 45 60 45 48C45 42 49 38 55 38C57 38 58 39 60 41C62 39 63 38 65 38C71 38 75 42 75 48C75 60 60 75 60 75Z"
        fill="currentColor"
        className="text-pink-500"
      />

      {/* Wellness dots - represents balance */}
      <circle
        cx="30"
        cy="30"
        r="3"
        fill="currentColor"
        className="text-blue-500"
      />
      <circle
        cx="90"
        cy="30"
        r="3"
        fill="currentColor"
        className="text-blue-500"
      />
      <circle
        cx="30"
        cy="90"
        r="3"
        fill="currentColor"
        className="text-blue-500"
      />
      <circle
        cx="90"
        cy="90"
        r="3"
        fill="currentColor"
        className="text-blue-500"
      />
    </svg>
  );
}

interface LogoWithTextProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoWithText({
  showText = true,
  size = "md",
  className = "",
}: LogoWithTextProps) {
  const sizes = {
    sm: { logo: 24, text: "text-lg" },
    md: { logo: 32, text: "text-xl" },
    lg: { logo: 48, text: "text-2xl" },
  };

  const currentSize = sizes[size];

  return (
    <Link
      href="/"
      className={`flex items-center space-x-2 hover:opacity-90 transition-opacity ${className}`}>
      <Logo width={currentSize.logo} height={currentSize.logo} />
      {showText && (
        <div className={`font-bold ${currentSize.text} tracking-tight`}>
          <span className="text-emerald-600">Life</span>
          <span className="text-gray-900 dark:text-white">Style</span>
          <span className="text-emerald-500 ml-1 text-sm">Hub</span>
        </div>
      )}
    </Link>
  );
}

export default LogoWithText;
