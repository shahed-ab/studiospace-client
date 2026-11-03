"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  imageClassName?: string;
}

export function Avatar({
  src,
  name,
  size = "md",
  className,
  imageClassName,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (str?: string | null) => {
    if (!str || typeof str !== "string") return "U";
    const clean = str.trim();
    if (!clean) return "U";
    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-20 h-20 text-xl font-bold",
  };

  const showImage = Boolean(src) && !hasError;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-elevated border border-border flex items-center justify-center font-heading font-semibold text-muted select-none shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={name || "User Avatar"}
          fill
          sizes={size === "xl" ? "80px" : "48px"}
          className={cn("object-cover", imageClassName)}
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

