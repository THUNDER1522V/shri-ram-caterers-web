"use client";

import { m, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

const LUXURY_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const getVariants = (staggerChildren: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: LUXURY_EASE,
      staggerChildren,
    },
  },
});

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: LUXURY_EASE,
    },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  staggerChildren = 0.08,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <m.div
      ref={ref}
      variants={getVariants(staggerChildren)}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={cn(className)}
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      variants={revealItemVariants}
      className={className}
      style={delay !== undefined ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </m.div>
  );
}
