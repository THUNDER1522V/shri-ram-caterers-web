import type { Transition, Variants } from "framer-motion";

/**
 * Luxury Motion Constants & Timing Curves
 * Embodying the brand philosophy: Calm, confident, restrained, timeless.
 */
export const MOTION_EASE = [0.16, 1, 0.3, 1] as const; // Custom luxury ease-out

export const MOTION_DURATION = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  cinematic: 0.8,
} as const;

export const transitionBase: Transition = {
  duration: MOTION_DURATION.normal,
  ease: MOTION_EASE,
};

export const transitionSlow: Transition = {
  duration: MOTION_DURATION.slow,
  ease: MOTION_EASE,
};

/**
 * Standard Reusable Motion Variants
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.slow,
      ease: MOTION_EASE,
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.slow,
      ease: MOTION_EASE,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};
