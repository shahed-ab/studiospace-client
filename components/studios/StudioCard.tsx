"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Studio } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";
import {
  FiMapPin,
  FiStar,
  FiHeart,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

interface StudioCardProps {
  studio: Studio;
  className?: string;
}

export function StudioCard({ studio, className }: { studio: Studio; className?: string }) {
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(studio._id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(studio._id, studio.title);
  };

  return (
    <div
      className={cn(
        "group relative h-full flex flex-col rounded-[20px] bg-surface border border-border overflow-hidden transition-all duration-300 card-hover",
        className
      )}
    >
      {/* 4:3 Aspect Ratio Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
        <Image
          src={studio.images[0] || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient shadow overlay for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-auto">
          <Badge variant="category" className="shadow-md">
            {studio.category.toUpperCase()}
          </Badge>

          <div className="flex items-center gap-2">
            {/* Rating pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 text-xs font-semibold text-foreground shadow-sm">
              <FiStar className="w-3 h-3 text-accent fill-accent" />
              <span>{studio.rating.toFixed(2)}</span>
              <span className="text-[10px] text-muted font-normal">
                ({studio.reviewCount})
              </span>
            </div>

            {/* Favorite Heart Button */}
            <button
              onClick={handleFavoriteClick}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 text-foreground hover:scale-110 active:scale-95 transition-all shadow-sm"
            >
              <FiHeart
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  saved
                    ? "text-accent fill-accent"
                    : "text-muted hover:text-foreground"
                )}
              />
            </button>
          </div>
        </div>

        {/* Bottom Image Callout Badge (Instant Book / Verified) */}
        {studio.instantBook && (
          <div className="absolute bottom-3 left-3 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] font-medium shadow-sm">
              <FiZap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              Instant Book
            </span>
          </div>
        )}

        {!studio.instantBook && studio.tags?.includes("400A Camlock") && (
          <div className="absolute bottom-3 left-3 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/80 backdrop-blur-md border border-sky-500/30 text-sky-400 text-[11px] font-medium shadow-sm">
              <FiCheckCircle className="w-3 h-3 text-sky-400" />
              Commercial Verified
            </span>
          </div>
        )}
      </div>

      {/* Card Content (equal height distribution) */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Studio Title */}
          <Link
            href={`/studios/${studio._id}`}
            className="block group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          >
            <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1 transition-colors group-hover/link:text-accent">
              {studio.title}
            </h3>
          </Link>

          {/* Location with Pin Icon */}
          <div className="flex items-center gap-1.5 text-xs text-muted mt-1.5">
            <FiMapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">{studio.location}</span>
          </div>

          {/* Feature Spec Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
            {studio.tags && studio.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-elevated text-muted border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Hourly Rate & View Details CTA */}
        <div className="pt-4 mt-5 border-t border-border flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-muted">
              Hourly Rate
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-heading text-xl font-bold text-foreground">
                ${studio.hourlyRate}
              </span>
              <span className="text-xs text-muted">/ hr</span>
            </div>
          </div>

          <Button asChild variant="primary" size="sm" className="px-4">
            <Link href={`/studios/${studio._id}`}>
              View Details
              <FiArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

