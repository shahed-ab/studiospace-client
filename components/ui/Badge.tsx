import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-surface text-foreground border border-border",
        accent:
          "bg-accent/15 text-accent border border-accent/30",
        secondary:
          "bg-elevated text-foreground border border-border",
        outline:
          "border border-border text-foreground bg-transparent",
        success:
          "bg-success/15 text-success border border-success/30",
        warning:
          "bg-warning/15 text-warning border border-warning/30",
        danger:
          "bg-danger/15 text-danger border border-danger/30",
        info:
          "bg-info/15 text-info border border-info/30",
        category:
          "bg-surface/90 backdrop-blur-md text-foreground border border-white/10 uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold py-1 px-2.5",
        verified:
          "bg-surface/90 backdrop-blur-md text-[#5AA9FF] border border-[#5AA9FF]/30 text-xs font-medium py-1 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

function Badge({
  className,
  variant,
  dot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColor ||
              (variant === "success"
                ? "bg-success"
                : variant === "danger"
                ? "bg-danger"
                : variant === "warning"
                ? "bg-warning"
                : variant === "info"
                ? "bg-info"
                : "bg-accent")
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

