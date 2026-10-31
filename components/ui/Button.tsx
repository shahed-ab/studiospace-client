import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-accent/90 shadow-subtle hover:shadow-accent-glow hover-glow",
        secondary:
          "bg-elevated text-foreground border border-border hover:bg-surface hover:border-white/20",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface hover:border-white/20",
        ghost:
          "text-foreground hover:bg-surface/70 hover:text-accent",
        danger:
          "bg-danger text-white hover:bg-danger/90 shadow-subtle",
        glass:
          "glass-pill text-foreground hover:border-accent/40 hover:text-accent",
      },
      size: {
        default: "h-11 px-6 min-h-[44px]",
        sm: "h-9 px-4 text-xs min-h-[36px]",
        lg: "h-12 px-8 text-base min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0 shrink-0",
        "icon-sm": "h-9 w-9 min-h-[36px] min-w-[36px] p-0 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

