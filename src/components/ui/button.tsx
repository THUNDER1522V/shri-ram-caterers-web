import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-btn font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-[#0B0B0B] hover:bg-[#B89358] hover:-translate-y-0.5 shadow-elevation-soft before:absolute before:inset-0 before:-translate-x-full hover:before:animate-sheen before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        secondary:
          "bg-wine text-ivory hover:bg-[#5C0D14] hover:-translate-y-0.5",
        outline:
          "border border-gold bg-transparent text-gold hover:bg-gold/10",
        ghost: "hover:bg-wine text-ivory",
        link: "text-gold underline-offset-4 hover:underline",
        whatsapp:
          "bg-[#25D366] text-white hover:bg-[#1EBE5D] hover:-translate-y-0.5 shadow-elevation-soft before:absolute before:inset-0 before:-translate-x-full hover:before:animate-sheen before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
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
