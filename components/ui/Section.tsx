import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: "default" | "sm" | "lg" | "none";
}

export function Section({
  children,
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  const spacingClasses = {
    none: "py-0",
    sm: "py-8 md:py-12",
    default: "py-10 md:py-20 lg:py-24",
    lg: "py-12 md:py-24 lg:py-32",
  };

  return (
    <section
      className={cn("relative w-full", spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}

