import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-elevated/70 border border-border/50",
        className
      )}
      {...props}
    />
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="rounded-[20px] bg-surface border border-border overflow-hidden h-full flex flex-col">
      {/* 4:3 image skeleton */}
      <div className="relative aspect-[4/3] w-full bg-elevated/80 animate-pulse">
        <div className="absolute top-3.5 left-3.5 w-24 h-6 rounded-full bg-surface/50" />
        <div className="absolute top-3.5 right-3.5 w-16 h-6 rounded-full bg-surface/50" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title skeleton */}
          <div className="h-6 w-3/4 rounded-md bg-elevated/80 animate-pulse" />
          {/* Location skeleton */}
          <div className="h-4 w-1/2 rounded-md bg-elevated/60 animate-pulse mt-2" />
          {/* Tags skeleton */}
          <div className="flex gap-2 mt-4">
            <div className="h-5 w-16 rounded-md bg-elevated/60 animate-pulse" />
            <div className="h-5 w-20 rounded-md bg-elevated/60 animate-pulse" />
            <div className="h-5 w-14 rounded-md bg-elevated/60 animate-pulse" />
          </div>
        </div>

        {/* Footer price & button skeleton */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div>
            <div className="h-3 w-14 rounded bg-elevated/50 animate-pulse mb-1" />
            <div className="h-6 w-20 rounded bg-elevated/80 animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded-full bg-elevated/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StudioDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title & Header skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-28 rounded-full bg-elevated" />
        <div className="h-10 w-2/3 rounded-lg bg-elevated" />
        <div className="h-5 w-1/3 rounded-md bg-elevated/70" />
      </div>

      {/* Gallery skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 aspect-[16/9] max-h-[520px]">
        <div className="md:col-span-3 rounded-2xl bg-elevated h-full" />
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="rounded-2xl bg-elevated flex-1" />
          <div className="rounded-2xl bg-elevated flex-1" />
        </div>
      </div>

      {/* Content columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-36 rounded-2xl bg-elevated" />
          <div className="h-48 rounded-2xl bg-elevated" />
        </div>
        <div className="h-96 rounded-2xl bg-elevated" />
      </div>
    </div>
  );
}

