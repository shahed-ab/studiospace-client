import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const isCentered = align === "center";
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        action && "flex flex-col md:flex-row md:items-end md:justify-between gap-6",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          isCentered && "items-center text-center mx-auto",
          isRight && "items-end text-right ml-auto",
          !isCentered && !isRight && "items-start text-left"
        )}
      >
        {eyebrow && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{eyebrow}</span>
          </div>
        )}

        <h2
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground",
            titleClassName
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              "text-base md:text-lg text-muted max-w-[65ch] leading-relaxed mt-3.5",
              isCentered && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 mt-4 md:mt-0 flex items-center">
          {action}
        </div>
      )}
    </div>
  );
}

