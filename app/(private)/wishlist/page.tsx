"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { StudioCard } from "@/components/studios/StudioCard";
import { StudioGridSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWishlist } from "@/context/wishlist-context";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { FiHeart } from "react-icons/fi";

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}

function WishlistContent() {
  const { wishlist, isLoading } = useWishlist();

  return (
    <div className="py-10 pb-24">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            YOUR COLLECTION
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Saved Studios
          </h1>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Your curated shortlist of production spaces and creative venues.
          </p>
        </div>

        {isLoading ? (
          <StudioGridSkeleton count={6} />
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={<FiHeart className="w-8 h-8 text-accent" />}
            title="No saved studios yet"
            description="Browse our curated marketplace and tap the heart icon to save studios you love for later."
            actionText="Explore Studios"
            actionHref="/studios"
          />
        ) : (
          <>
            <p className="text-sm text-muted mb-6">
              {wishlist.length} saved space{wishlist.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

