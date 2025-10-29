"use client";

import React, { useEffect, useState } from "react";
import LogoLoop, { LogoItem } from "@/components/LogoLoop";
import { categories } from "./categories";

export default function LoopIcons() {
  const [fadeColor, setFadeColor] = useState("#ffffff"); // default for light mode

  useEffect(() => {
    const darkMode = document.documentElement.classList.contains("dark");
    setFadeColor(darkMode ? "#1f2937" : "#ffffff"); // gray-800 for dark, white for light
  }, []);

  const categoryLogos: LogoItem[] = categories.map((cat) => ({
    node: cat.icon,
    href: cat.href,
    title: cat.name,
    ariaLabel: cat.description,
  }));

  return (
    <div style={{ height: "200px", position: "relative", overflow: "hidden" }}>
      <LogoLoop
        logos={categoryLogos}
        speed={100}
        direction="left"
        logoHeight={48}
        gap={50}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor={fadeColor}
        ariaLabel="Category Icons"
      />
    </div>
  );
}
