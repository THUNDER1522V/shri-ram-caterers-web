"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeInVariants,
  slideUpVariants,
  staggerContainerVariants,
  MOTION_DURATION,
  MOTION_EASE,
} from "@/lib/motion";

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeInVariants}
      transition={{
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className, delay = 0 }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={slideUpVariants}
      transition={{
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
