"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Studio } from "@/types";
import { getStudioById } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { StudioForm } from "@/components/studios/StudioForm";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StudioDetailsSkeleton } from "@/components/shared/Skeletons";
import { FiAlertTriangle, FiArrowLeft, FiLock } from "react-icons/fi";

export default function EditStudioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getStudioById(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setStudio(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container className="py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-elevated animate-pulse" />
          <div className="space-y-2">
            <div className="w-48 h-6 bg-elevated rounded animate-pulse" />
            <div className="w-32 h-4 bg-elevated rounded animate-pulse" />
          </div>
        </div>
        <StudioDetailsSkeleton />
      </Container>
    );
  }

  if (notFound || !studio) {
    return (
      <Container className="py-24 max-w-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-danger/15 text-danger flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Studio Not Found
        </h2>
        <p className="text-muted text-sm mb-6">
          The requested studio listing could not be found or has been removed.
        </p>
        <Button asChild variant="primary">
          <Link href="/my-listings">
            <FiArrowLeft className="mr-2 w-4 h-4" />
            Return to My Listings
          </Link>
        </Button>
      </Container>
    );
  }

  // Section 6: Owner-only rule (Edit must only allow the owner)
  const isOwner =
    user?.email &&
    studio.ownerEmail &&
    user.email.toLowerCase() === studio.ownerEmail.toLowerCase();

  // Also allow admin role if needed
  const isAdmin = user?.role === "admin";

  if (!isOwner && !isAdmin) {
    return (
      <Container className="py-24 max-w-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-warning/15 text-warning flex items-center justify-center mx-auto mb-4">
          <FiLock className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Unauthorized Access
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-6">
          You do not have permission to edit &ldquo;{studio.title}&rdquo;. Only the listing host ({studio.ownerEmail}) is authorized to modify this stage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/my-listings">My Studio Listings</Link>
          </Button>
          <Button asChild variant="primary">
            <Link href={`/studios/${studio._id}`}>View Public Page</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return <StudioForm initialData={studio} mode="edit" />;
}

