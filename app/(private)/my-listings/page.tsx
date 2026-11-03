"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Studio } from "@/types";
import { getMyStudios, deleteStudio } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { StudioCardSkeleton } from "@/components/shared/Skeletons";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiCheckCircle,
  FiCamera,
  FiStar,
} from "react-icons/fi";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deletingStudio, setDeletingStudio] = useState<Studio | null>(null);

  const fetchStudios = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await getMyStudios(user.email);
      setStudios(data);
    } catch {
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchStudios();
  }, [fetchStudios]);

  const handleDeleteConfirm = async () => {
    if (!deletingStudio) return;
    try {
      await deleteStudio(deletingStudio._id);
      setStudios((prev) => prev.filter((s) => s._id !== deletingStudio._id));
      toast.success("Studio listing removed", {
        description: `"${deletingStudio.title}" has been removed from public search.`,
      });
    } catch {
      toast.error("Failed to delete studio listing");
    } finally {
      setDeletingStudio(null);
    }
  };

  return (
    <div className="py-10 pb-24">
      <Container>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              HOST INVENTORY MANAGEMENT
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              My Studio Listings
            </h1>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Manage live production stages, edit hourly rates, and audit soundstage availability.
            </p>
          </div>

          <Button asChild variant="primary" size="lg" className="self-start sm:self-center gap-2">
            <Link href="/add-studio">
              <FiPlus className="w-4 h-4" />
              Add New Studio
            </Link>
          </Button>
        </div>

        {/* Quick Metrics Bar */}
        {!loading && studios.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs text-muted">Active Stages</span>
              <div className="font-heading text-2xl font-bold text-foreground mt-0.5">
                {studios.length} Spaces
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs text-muted">Avg Hourly Rate</span>
              <div className="font-heading text-2xl font-bold text-foreground mt-0.5">
                $
                {Math.round(
                  studios.reduce((acc, s) => acc + s.hourlyRate, 0) / studios.length
                )}
                /hr
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs text-muted">Avg Crew Capacity</span>
              <div className="font-heading text-2xl font-bold text-foreground mt-0.5">
                {Math.round(
                  studios.reduce((acc, s) => acc + s.maxCapacity, 0) / studios.length
                )}{" "}
                Crew
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <span className="text-xs text-muted">Host Reputation</span>
              <div className="font-heading text-2xl font-bold text-accent flex items-center gap-1 mt-0.5">
                <FiStar className="w-5 h-5 fill-accent" />
                4.96
              </div>
            </div>
          </div>
        )}

        {/* Listings Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Studio Listings Yet"
              description="You haven't listed any creative workspaces or soundstages yet. List your space to begin hosting production crews and monetizing dark shoot days."
              actionText="List Your First Studio"
              actionHref="/add-studio"
              icon={<FiCamera className="w-8 h-8 text-accent" />}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="group rounded-[20px] bg-surface border border-border overflow-hidden flex flex-col h-full hover:border-accent/40 transition-colors shadow-sm"
              >
                {/* 4:3 Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
                  <Image
                    src={studio.images[0] || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"}
                    alt={studio.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="category">{studio.category}</Badge>
                    {studio.instantBook && (
                      <Badge variant="success" className="text-[10px]">
                        Instant Hold
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-elevated/90 backdrop-blur-sm border border-white/10 text-xs font-semibold text-foreground">
                    <FiStar className="w-3 h-3 text-warning fill-warning" />
                    {studio.rating.toFixed(1)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1">
                      {studio.title}
                    </h3>
                    <p className="text-xs text-muted line-clamp-1 flex items-center gap-1 mt-1">
                      <FiMapPin className="w-3.5 h-3.5 shrink-0" />
                      {studio.location}
                    </p>

                    {/* Spec tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {studio.sqft && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-elevated border border-border text-foreground/80">
                          {studio.sqft.toLocaleString()} sq ft
                        </span>
                      )}
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-elevated border border-border text-foreground/80">
                        Max {studio.maxCapacity} crew
                      </span>
                      {studio.power && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-elevated border border-border text-foreground/80">
                          {studio.power}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-border mt-auto">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="font-heading text-xl font-bold text-foreground">
                          ${studio.hourlyRate}
                        </span>
                        <span className="text-xs text-muted">/hr</span>
                      </div>
                      <span className="text-xs text-muted font-medium">
                        ${studio.securityDeposit} deposit
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 justify-center"
                      >
                        <Link href={`/studios/${studio._id}`} target="_blank">
                          <FiExternalLink className="mr-1 w-3.5 h-3.5" />
                          View
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="text-xs px-2 justify-center"
                      >
                        <Link href={`/studios/edit/${studio._id}`}>
                          <FiEdit2 className="mr-1 w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        className="text-xs px-2 justify-center"
                        onClick={() => setDeletingStudio(studio)}
                      >
                        <FiTrash2 className="mr-1 w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal (Rule 11) */}
        <ConfirmModal
          isOpen={Boolean(deletingStudio)}
          onClose={() => setDeletingStudio(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Studio Listing?"
          description={`Are you sure you want to permanently delete "${deletingStudio?.title}"? This will remove the stage from search results. Confirmed upcoming bookings will remain on your schedule.`}
          confirmText="Delete Studio"
          cancelText="Keep Listing"
          variant="danger"
        />
      </Container>
    </div>
  );
}
