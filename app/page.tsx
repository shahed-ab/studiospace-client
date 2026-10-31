"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StudioCard } from "@/components/studios/StudioCard";
import { StudioGridSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useAuth } from "@/lib/auth";
import { getFeaturedStudios } from "@/lib/api";
import { Studio } from "@/types";
import {
  FiZap,
  FiUser,
  FiTrash2,
  FiLayers,
  FiArrowRight,
  FiSearch,
} from "react-icons/fi";

export default function Home() {
  const { user, toggleMockUser } = useAuth();
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function loadStudios() {
      try {
        setLoading(true);
        const data = await getFeaturedStudios();
        setFeaturedStudios(data);
      } catch (err) {
        console.error("Error loading studios:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudios();
  }, []);

  const handleDeleteDemo = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Studio deleted successfully", {
      description: "Listing removed from marketplace index.",
    });
  };

  return (
    <main className="min-h-screen py-10">
      <Container>
        {/* Phase 2 Banner / Status Card */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Badge variant="accent" dot>
                  Phase 2 Verification
                </Badge>
                <span className="text-xs text-muted">
                  Navbar, Footer, Data Layer, Auth & Shared Components
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                StudioSpace Infrastructure Ready
              </h1>
              <p className="text-sm text-muted max-w-2xl leading-relaxed">
                Active Session:{" "}
                {user ? (
                  <strong className="text-foreground">
                    {user.name} ({user.email}) — Role: {user.email.includes("host") ? "Host" : "Creator"}
                  </strong>
                ) : (
                  <strong className="text-foreground">Logged Out (Guest)</strong>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleMockUser}
                className="gap-2"
              >
                <FiUser className="w-3.5 h-3.5 text-accent" />
                Toggle User Persona
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSkeleton(!showSkeleton)}
              >
                <FiLayers className="mr-1.5 w-3.5 h-3.5" />
                {showSkeleton ? "Show Live Cards" : "Simulate Skeletons"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowConfirmModal(true)}
              >
                <FiTrash2 className="mr-1.5 w-3.5 h-3.5" />
                Test Confirm Modal
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Studio Cards Grid Showcase (Strict 3-col desktop, 2-col tablet, 1-col mobile) */}
        <Section spacing="sm">
          <SectionHeading
            eyebrow="CURATED SPACES"
            title="Featured Studios in High Demand"
            description="Architectural spaces engineered for flawless lighting, absolute acoustic separation, and frictionless production days."
            action={
              <Button asChild variant="ghost" className="gap-2">
                <a href="#empty-state-demo">
                  View all 1,200+ studios
                  <FiArrowRight className="w-4 h-4 text-accent" />
                </a>
              </Button>
            }
          />

          {loading || showSkeleton ? (
            <StudioGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </Section>

        {/* Empty State Component Showcase */}
        <Section spacing="sm" id="empty-state-demo">
          <SectionHeading
            eyebrow="ZERO-STATE RESILIENCE"
            title="Empty State Experience"
            description="Rule 9: Friendly empty states with clear CTAs when filters, searches, or listings return no data."
          />

          <EmptyState
            icon={<FiSearch className="w-8 h-8 text-accent" />}
            title="No production stages found"
            description="We could not find any studios matching your current filter criteria. Try adjusting your dates, budget, or medium categories."
            actionText="Reset All Filters"
            onAction={() =>
              toast.info("Filter reset requested", {
                description: "All search parameters reverted to defaults.",
              })
            }
            secondaryActionText="Browse All Categories"
            onSecondaryAction={() =>
              toast.info("Category browser opened")
            }
          />
        </Section>
      </Container>

      {/* Confirmation Modal Component Test */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteDemo}
        title="Delete Studio Listing?"
        description="Are you sure you want to remove this studio? All upcoming bookings will be cancelled and this action cannot be undone."
        confirmText="Yes, Delete Listing"
        variant="danger"
      />
    </main>
  );
}
