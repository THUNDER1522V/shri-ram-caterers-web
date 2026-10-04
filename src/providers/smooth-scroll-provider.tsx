"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicLenis = dynamic(
  () => import("lenis/react").then((mod) => mod.ReactLenis),
  { ssr: false }
);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [canLoadLenis, setCanLoadLenis] = useState(false);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is requested
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    // Load Lenis only after first paint / idle (requestIdleCallback with setTimeout fallback)
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (
        window as unknown as {
          requestIdleCallback: (
            cb: () => void,
            opts?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback(() => setCanLoadLenis(true), { timeout: 2000 });

      return () => {
        if ("cancelIdleCallback" in window) {
          (
            window as unknown as { cancelIdleCallback: (id: number) => void }
          ).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => setCanLoadLenis(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!canLoadLenis) {
    return <>{children}</>;
  }

  return (
    <DynamicLenis root options={{ lerp: 0.1 }}>
      {children}
    </DynamicLenis>
  );
}
