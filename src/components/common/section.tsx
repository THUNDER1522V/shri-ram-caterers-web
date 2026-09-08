import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

/**
 * Standardized layout section enforcing editorial luxury spacing:
 * Desktop: 120px (py-[120px] / lg:py-[120px])
 * Tablet: 80px (md:py-20)
 * Mobile: 64px (py-16)
 */
export function Section({
  as: Component = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn("py-16 md:py-20 lg:py-[120px]", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
