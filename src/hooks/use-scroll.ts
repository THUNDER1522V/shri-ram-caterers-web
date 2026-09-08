"use client";

import { useState, useEffect } from "react";

/**
 * Tracks whether the user has scrolled past a specific threshold.
 * Used for sticky navbar background opacity and elevation transitions.
 */
export function useScroll(threshold: number = 20): boolean {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
