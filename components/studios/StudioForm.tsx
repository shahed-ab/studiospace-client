"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Studio, StudioCategory } from "@/types";
import { useAuth } from "@/lib/auth";
import { createStudio, updateStudio } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiDollarSign,
  FiUsers,
  FiMapPin,
  FiCheck,
  FiShield,
  FiLock,
  FiEye,
  FiInfo,
} from "react-icons/fi";

const CATEGORIES: StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const AVAILABLE_AMENITIES = [
  "Cyc Wall",
  "Camlock 3-Phase Power",
  "Freight Elevator",
  "Sound Isolation NC-25",
  "Lighting Grip Package",
  "Hair & Makeup Stations",
  "Kitchen / Craft Service",
  "High-Speed WiFi 1Gbps",
  "Client Green Room",
  "Blackout Blinds",
  "Drive-In Elephant Door",
  "Central HVAC Isolation",
  "Private Dressing Rooms",
  "Color Grading Suite",
  "Equipment Loading Dock",
];

const studioFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.enum(
    ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"],
    { required_error: "Please select a studio category" }
  ),
  hourlyRate: z.coerce.number().min(25, "Hourly rate must be at least $25"),
  securityDeposit: z.coerce.number().min(0, "Security deposit cannot be negative"),
  maxCapacity: z.coerce.number().min(1, "Capacity must be at least 1 person"),
  sqft: z.coerce.number().min(100, "Square footage must be at least 100").optional(),
  ceilingHeight: z.string().min(1, "Ceiling height is required"),
  power: z.string().min(1, "Power specifications are required"),
  location: z.string().min(8, "Please enter a valid full street address"),
  city: z.string().min(2, "City name is required"),
  primaryImage: z.string().url("Please provide a valid image URL"),
  additionalImages: z.string().optional(),
  overview: z.string().min(30, "Please provide a detailed overview of at least 30 characters"),
});

type StudioFormData = z.infer<typeof studioFormSchema>;

interface StudioFormProps {
  initialData?: Studio;
  mode: "create" | "edit";
}

const DEFAULT_SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80",
];

export function StudioForm({ initialData, mode }: StudioFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || [
      "Cyc Wall",
      "Lighting Grip Package",
      "Hair & Makeup Stations",
      "High-Speed WiFi 1Gbps",
    ]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudioFormData>({
    resolver: zodResolver(studioFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "Photo Studio",
      hourlyRate: initialData?.hourlyRate || 120,
      securityDeposit: initialData?.securityDeposit || 250,
      maxCapacity: initialData?.maxCapacity || 25,
      sqft: initialData?.sqft || 2400,
      ceilingHeight: initialData?.ceilingHeight || "18 ft",
      power: initialData?.power || "200A 3-Phase",
      location: initialData?.location || "",
      city: initialData?.city || "New York",
      primaryImage: initialData?.images?.[0] || DEFAULT_SAMPLE_IMAGES[0],
      additionalImages: initialData?.images?.slice(1).join("\n") || DEFAULT_SAMPLE_IMAGES.slice(1).join("\n"),
      overview: initialData?.overview || "",
    },
  });

  const primaryImagePreview = watch("primaryImage");

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data: StudioFormData) => {
    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one production amenity");
      return;
    }

    if (!user) {
      toast.error("You must be signed in to manage studio listings");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse additional images from newline or comma
      const extraImages = (data.additionalImages || "")
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.startsWith("http"));

      const allImages = [data.primaryImage, ...extraImages];

      if (mode === "create") {
        await createStudio({
          title: data.title,
          category: data.category,
          originalLabel: data.category,
          hourlyRate: data.hourlyRate,
          securityDeposit: data.securityDeposit,
          maxCapacity: data.maxCapacity,
          sqft: data.sqft,
          ceilingHeight: data.ceilingHeight,
          power: data.power,
          location: data.location,
          city: data.city,
          images: allImages,
          amenities: selectedAmenities,
          overview: data.overview,
          ownerName: user.name || "Studio Host",
          ownerEmail: user.email || "host@studiospace.io",
          ownerAvatar: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          instantBook: true,
          rules: [
            "No smoking or open flame on set without union fire safety officer",
            "Proof of insurance (COI) required for crew sizes over 15",
            "Stages must be swept and wrapped by the scheduled end time",
          ],
        });

        toast.success("Studio Listing Published!", {
          description: `"${data.title}" is now active and ready for bookings.`,
        });
      } else if (initialData) {
        await updateStudio(initialData._id, {
          title: data.title,
          category: data.category,
          hourlyRate: data.hourlyRate,
          securityDeposit: data.securityDeposit,
          maxCapacity: data.maxCapacity,
          sqft: data.sqft,
          ceilingHeight: data.ceilingHeight,
          power: data.power,
          location: data.location,
          city: data.city,
          images: allImages,
          amenities: selectedAmenities,
          overview: data.overview,
        });

        toast.success("Studio Listing Updated!", {
          description: `Changes to "${data.title}" have been saved.`,
        });
      }

      router.push("/my-listings");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save listing";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 pb-24">
      <Container className="max-w-4xl">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors mb-4"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            Back to My Listings
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {mode === "create" ? "NEW STAGE LISTING" : "EDIT PRODUCTION STAGE"}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                {mode === "create" ? "Publish a New Creative Space" : `Update ${initialData?.title}`}
              </h1>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                {mode === "create"
                  ? "Define union electrical specs, hourly rates, cyc dimensions, and house rules."
                  : "Modify your stage pricing, dimensions, and production amenities."}
              </p>
            </div>

            <Badge variant="accent" className="self-start sm:self-center">
              Verified Host Portal
            </Badge>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ─── SECTION 1: ESSENTIAL DETAILS ─── */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border space-y-6">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                1
              </span>
              Space Essentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Studio Title *
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Apex Soundstage & Cyc Loft"
                  className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                {errors.title && (
                  <p className="text-xs text-danger mt-1.5">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Studio Category *
                  </label>
                  <select
                    {...register("category")}
                    className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-danger mt-1.5">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    City / Production Hub *
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    placeholder="e.g. Brooklyn, NY"
                    className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                  {errors.city && (
                    <p className="text-xs text-danger mt-1.5">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Full Venue Street Address *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="text"
                    {...register("location")}
                    placeholder="e.g. 142 Greenpoint Ave, Building B, Brooklyn, NY 11222"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-danger mt-1.5">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* ─── SECTION 2: RATES & CAPACITY ─── */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border space-y-6">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                2
              </span>
              Rates, Specs &amp; Capacity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Hourly Rate ($/hr) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="number"
                    {...register("hourlyRate")}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-medium"
                  />
                </div>
                {errors.hourlyRate && (
                  <p className="text-xs text-danger mt-1.5">{errors.hourlyRate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Security Deposit ($) *
                </label>
                <div className="relative">
                  <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="number"
                    {...register("securityDeposit")}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-medium"
                  />
                </div>
                {errors.securityDeposit && (
                  <p className="text-xs text-danger mt-1.5">{errors.securityDeposit.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Max Crew Capacity *
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="number"
                    {...register("maxCapacity")}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-medium"
                  />
                </div>
                {errors.maxCapacity && (
                  <p className="text-xs text-danger mt-1.5">{errors.maxCapacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Total Area (sq ft)
                </label>
                <input
                  type="number"
                  {...register("sqft")}
                  placeholder="2400"
                  className="w-full px-3 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Ceiling Height *
                </label>
                <input
                  type="text"
                  {...register("ceilingHeight")}
                  placeholder="e.g. 18 ft grid"
                  className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                {errors.ceilingHeight && (
                  <p className="text-xs text-danger mt-1.5">{errors.ceilingHeight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Electrical Power Capacity *
                </label>
                <input
                  type="text"
                  {...register("power")}
                  placeholder="e.g. 200A 3-Phase Camlock"
                  className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                {errors.power && (
                  <p className="text-xs text-danger mt-1.5">{errors.power.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* ─── SECTION 3: MEDIA & LIVE PREVIEW ─── */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border space-y-6">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                3
              </span>
              Photography &amp; Live Preview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Primary Stage Photo URL *
                  </label>
                  <input
                    type="url"
                    {...register("primaryImage")}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-mono text-xs"
                  />
                  {errors.primaryImage && (
                    <p className="text-xs text-danger mt-1.5">{errors.primaryImage.message}</p>
                  )}
                  <p className="text-[11px] text-muted mt-1">
                    Provide a high-resolution, landscape-oriented image URL (aspect ratio 4:3 or 16:9).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Additional Gallery Image URLs (one per line)
                  </label>
                  <textarea
                    rows={3}
                    {...register("additionalImages")}
                    placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                    className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Sample quick presets */}
                <div>
                  <span className="text-[11px] font-semibold text-muted block mb-1.5">
                    Quick Sample Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SAMPLE_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setValue("primaryImage", img, { shouldValidate: true })}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-elevated border border-border hover:border-accent text-muted hover:text-foreground transition-colors"
                      >
                        Sample Preset #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="md:col-span-5">
                <span className="block text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <FiEye className="w-3.5 h-3.5 text-accent" />
                  Live Marketplace Card Preview
                </span>
                <div className="rounded-[20px] overflow-hidden bg-elevated border border-border shadow-md">
                  <div className="relative aspect-[4/3] w-full bg-background overflow-hidden">
                    {primaryImagePreview && primaryImagePreview.startsWith("http") ? (
                      <Image
                        src={primaryImagePreview}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted p-4 text-center">
                        <FiUploadCloud className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">Enter a valid image URL</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge variant="category">{watch("category") || "Studio"}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading text-sm font-bold text-foreground truncate">
                      {watch("title") || "Untitled Studio Space"}
                    </h4>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {watch("location") || "Location not set"}
                    </p>
                    <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-border">
                      <span className="font-heading text-base font-bold text-foreground">
                        ${watch("hourlyRate") || 0}
                        <span className="text-xs text-muted font-normal">/hr</span>
                      </span>
                      <span className="text-xs text-muted">
                        Max {watch("maxCapacity") || 0} crew
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SECTION 4: AMENITIES ─── */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                  4
                </span>
                Production Amenities &amp; Features *
              </h2>
              <span className="text-xs text-muted font-medium">
                {selectedAmenities.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between select-none ${
                      isSelected
                        ? "bg-accent/10 border-accent text-accent font-semibold shadow-sm"
                        : "bg-elevated border-border text-muted hover:border-border hover:text-foreground"
                    }`}
                  >
                    <span className="truncate pr-2">{amenity}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-accent border-accent text-white"
                          : "border-border bg-surface"
                      }`}
                    >
                      {isSelected && <FiCheck className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── SECTION 5: DETAILED OVERVIEW ─── */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-surface border border-border space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                5
              </span>
              Detailed Space Overview *
            </h2>

            <div>
              <textarea
                rows={5}
                {...register("overview")}
                placeholder="Describe stage acoustics, cyc curvature, lighting package inclusions, drive-in logistics, and union production protocols..."
                className="w-full px-4 py-3 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none leading-relaxed"
              />
              {errors.overview && (
                <p className="text-xs text-danger mt-1.5">{errors.overview.message}</p>
              )}
            </div>
          </div>

          {/* ─── SECTION 6: READ-ONLY HOST IDENTITY (Rule 10) ─── */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-elevated/70 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <FiLock className="w-4 h-4 text-accent" />
                Verified Host Identity (Read-only)
              </h3>
              <Badge variant="verified" className="text-xs">
                Active Session
              </Badge>
            </div>
            <p className="text-xs text-muted">
              These details are populated automatically from your verified host account and cannot be modified per listing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Host Name
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={user?.name || "Host Account"}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface/80 border border-border text-foreground/80 text-sm cursor-not-allowed font-medium select-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                  Host Email
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={user?.email || "host@studiospace.io"}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface/80 border border-border text-foreground/80 text-sm cursor-not-allowed font-mono text-xs select-none"
                />
              </div>
            </div>
          </div>

          {/* ─── ACTION BUTTONS ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <Button
              asChild
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/my-listings">Cancel</Link>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Listing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {mode === "create" ? "Publish Studio Listing" : "Save Changes"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
