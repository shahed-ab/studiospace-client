import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function ApertureIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-[#151518] border border-white/10 shadow-sm shrink-0 overflow-hidden",
        className || "w-9 h-9"
      )}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        {/* Four crosshair tick marks (white) */}
        <line x1="20" y1="5" x2="20" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="31" x2="20" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="20" x2="9" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="31" y1="20" x2="35" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />

        {/* Dashed orange focus circle */}
        <circle
          cx="20"
          cy="20"
          r="10.5"
          stroke="#FF5B2E"
          strokeWidth="2.2"
          strokeDasharray="4.2 3.5"
        />

        {/* Solid center dot */}
        <circle cx="20" cy="20" r="3.2" fill="#FF5B2E" />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  showWordmark = true,
  size = "md",
  href = "/",
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: "w-7 h-7 rounded-lg", text: "text-lg tracking-tight" },
    md: { icon: "w-9 h-9 rounded-xl", text: "text-xl tracking-tight font-bold" },
    lg: { icon: "w-11 h-11 rounded-2xl", text: "text-2xl tracking-tight font-bold" },
  };

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <ApertureIcon className={sizeClasses[size].icon} />
      {showWordmark && (
        <span
          className={cn(
            "font-heading font-bold text-foreground transition-colors group-hover:text-accent",
            sizeClasses[size].text
          )}
        >
          Studio<span className="text-foreground">Space</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}

