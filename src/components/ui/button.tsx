import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-btn font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-gold-600 hover:-translate-y-0.5 shadow-elevation-soft",
        secondary:
          "bg-muted text-foreground hover:bg-ivory-300 hover:-translate-y-0.5",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:border-gold-300",
        ghost: "hover:bg-muted text-foreground",
        link: "text-gold-600 underline-offset-4 hover:underline",
        whatsapp:
          "bg-[#25D366] text-white hover:bg-[#1EBE5D] hover:-translate-y-0.5 shadow-elevation-soft",
      },
      size: {
        default: "h-12 px-6 text-base", // 48px standard
        lg: "h-[52px] px-8 text-base",  // 52px editorial primary
        sm: "h-10 px-4 text-sm",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(
          buttonVariants({ variant, size }),
          child.props.className,
          className
        ),
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
