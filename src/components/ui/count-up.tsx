"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function formatValue(val: number, target: number): string {
  if (target >= 1000) {
    return Math.floor(val).toLocaleString("en-US");
  }
  if (target % 1 !== 0) {
    return val.toFixed(1);
  }
  return Math.floor(val).toString();
}

export function CountUp({ value, suffix = "", prefix = "", duration = 1.6 }: CountUpProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(numberRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView || !numberRef.current) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      numberRef.current.textContent = `${prefix}${formatValue(value, value)}`;
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // luxury easing
      onUpdate: (v) => {
        if (numberRef.current) {
          numberRef.current.textContent = `${prefix}${formatValue(v, value)}`;
        }
      },
      onComplete: () => {
        if (numberRef.current) {
          numberRef.current.textContent = `${prefix}${formatValue(value, value)}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, prefix]);

  return (
    <span className="inline-flex items-baseline">
      <span ref={numberRef} className="tabular-nums">
        {prefix}{formatValue(value, value)}
      </span>
      {suffix && (
        <span className="font-sans font-bold text-[#D4A84B] ml-0.5 select-none text-[0.85em] leading-none" aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  );
}

export default CountUp;
