import type { Variants } from "framer-motion";

export const LUXURY_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export const FADE_UP = (delay = 0, distance = 28): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: LUXURY_EASE, delay },
  },
});

export const FADE_IN = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: LUXURY_EASE, delay },
  },
});

export const SCALE_IN = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: LUXURY_EASE, delay },
  },
});

export const STAGGER_CONTAINER = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
