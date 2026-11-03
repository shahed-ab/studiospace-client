"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStudioById } from "@/lib/api";
import { Studio } from "@/types";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { BookingModal } from "@/components/studios/BookingModal";
import { StudioDetailsSkeleton } from "@/components/shared/Skeletons";
import { cn } from "@/lib/utils";
import {
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiStar,
  FiMapPin,
  FiUsers,
  FiZap,
  FiCheckCircle,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiGrid,
} from "react-icons/fi";
import { MdOutlineSquareFoot } from "react-icons/md";

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

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
      <Container className="py-10">
        <StudioDetailsSkeleton />
      </Container>
    );
  }

  if (notFound || !studio) {
    return (
      <Container className="py-24 text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Studio Not Found</h2>
        <p className="text-muted mb-8">This space may have been removed or the link is incorrect.</p>
        <Button asChild variant="primary">
          <Link href="/studios">Browse All Studios</Link>
        </Button>
      </Container>
    );
  }

  const isOwner = user?.email === studio.ownerEmail;
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = studio ? isSaved(studio._id) : false;

  const handleToggleWishlist = async () => {
    if (!studio) return;
    await toggleWishlist(studio._id, studio.title);
  };

  const prevImage = () => setActiveImage((a) => (a - 1 + studio.images.length) % studio.images.length);
  const nextImage = () => setActiveImage((a) => (a + 1) % studio.images.length);

  return (
    <div className="pb-20">
      {/* ─── BREADCRUMB ─── */}
      <div className="border-b border-border py-3">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs text-muted">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <FiHome className="w-3.5 h-3.5" /> Home
              </Link>
              <span>/</span>
              <Link href="/studios" className="hover:text-foreground transition-colors">Explore Studios</Link>
              <span>/</span>
              <Link href={`/studios?category=${encodeURIComponent(studio.category)}`} className="hover:text-foreground transition-colors">
                {studio.category}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{studio.title}</span>
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-xs"
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.share) {
                    navigator.share({ title: studio.title, url: window.location.href });
                  } else if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }
                }}
              >
                <FiShare2 className="w-4 h-4" /> Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 text-xs transition-colors",
                  saved ? "text-accent font-semibold" : "text-muted hover:text-foreground"
                )}
                onClick={handleToggleWishlist}
              >
                <FiHeart className={cn("w-4 h-4", saved && "text-accent fill-accent")} />
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── HERO GALLERY ─── */}
      <div className="relative w-full aspect-[16/7] max-h-[520px] overflow-hidden bg-elevated">
        {/* Active large image */}
        {studio.images.map((img, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              i === activeImage ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={img}
              alt={`${studio.title} – photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Overlay info */}
        <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase text-white/90 tracking-wider">
            {studio.originalLabel || studio.category}
          </span>
          {studio.instantBook && (
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Set Ready
            </span>
          )}
        </div>

        {/* View all photos button */}
        <div className="absolute bottom-5 right-5 z-10">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-sm text-white/90 hover:bg-black/80 transition-colors">
            <FiGrid className="w-4 h-4" />
            View All {studio.images.length * 4} Photos
          </button>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label="Previous image"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label="Next image"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ─── THUMBNAIL STRIP ─── */}
      <div className="bg-background border-b border-border">
        <Container>
          <div className="flex gap-3 py-4 overflow-x-auto scrollbar-none">
            {studio.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative flex-shrink-0 w-36 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all",
                  i === activeImage ? "border-accent opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <div className="absolute bottom-1 left-1 right-1">
                  <span className="text-[9px] font-semibold uppercase text-white/80 px-1">
                    {["01 CYC STAGE", "02 H&MU LOUNGE", "03 MEZZANINE", "04 POWER DISTRO"][i] || `0${i + 1} AREA`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <Container className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ─── LEFT: Details ─── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title block */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="category">{studio.category} &amp; DAYLIGHT CYC</Badge>
                {studio.instantBook && (
                  <Badge variant="info" className="flex items-center gap-1">
                    <FiCheckCircle className="w-3 h-3" /> Commercial Verified Production Tier
                  </Badge>
                )}
                {studio.instantBook && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <FiZap className="w-3 h-3" /> Instant Book Enabled
                  </Badge>
                )}
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-3">
                {studio.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-accent font-semibold">
                  <FiStar className="w-4 h-4 fill-accent" />
                  <span>{studio.rating.toFixed(2)}</span>
                  <span className="text-muted font-normal">({studio.reviewCount} certified reviews)</span>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5 text-muted">
                  <FiMapPin className="w-4 h-4 text-accent" />
                  {studio.location}
                </div>
                {studio.city && (
                  <span className="text-xs text-muted bg-elevated border border-border px-2 py-0.5 rounded-full">
                    12 min to {studio.city === "New York" ? "Manhattan" : studio.city} Center
                  </span>
                )}
              </div>
            </div>

            {/* Spec cards row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: "Floor Space", value: studio.squareFeet ? `${studio.squareFeet.toLocaleString()}` : "—", unit: "Square Feet", icon: MdOutlineSquareFoot },
                { label: "Clearance", value: studio.ceilingHeight || "—", unit: "To Lighting Truss", icon: FiArrowLeft },
                { label: "Capacity", value: `${studio.maxCapacity} Max`, unit: "Cast & Production", icon: FiUsers },
                { label: "Power Grid", value: "300A", unit: "Camlock + Edison", icon: FiZap },
                { label: "Access", value: "Drive-in", unit: "Street Rollup Gate", icon: FiHome },
              ].map((spec) => (
                <div key={spec.label} className="p-4 rounded-2xl bg-surface border border-border text-center">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-muted mb-1">{spec.label}</div>
                  <div className="font-heading text-xl font-bold text-foreground mb-0.5">{spec.value}</div>
                  <div className="text-[10px] text-muted">{spec.unit}</div>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                Spatial Pedigree &amp; Specifications
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground/85 leading-relaxed text-base">{studio.overview}</p>
              </div>
            </div>

            {/* Amenities grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  Production Amenities &amp; Rigging
                </h2>
                <span className="text-xs text-accent font-medium">All-Inclusive Standard Rate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studio.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-border">
                    <div className="w-9 h-9 rounded-xl bg-elevated border border-border flex items-center justify-center shrink-0 text-accent font-bold text-sm">
                      {amenity[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{amenity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Card */}
            <div className="p-6 rounded-[20px] bg-surface border border-border">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-elevated border border-border shrink-0">
                  <Avatar
                    src={studio.ownerAvatar}
                    name={studio.ownerName}
                    size="xl"
                    className="w-full h-full rounded-2xl border-0"
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center border-2 border-surface">
                    <FiCheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-heading text-lg font-bold text-foreground">{studio.ownerName}</h3>
                    <Badge variant="accent" className="text-xs">Superhost</Badge>
                  </div>
                  <p className="text-xs text-muted mb-4">Studio Director &amp; Executive Producer at Lumen Studios</p>

                  <p className="text-sm text-foreground/80 leading-relaxed italic mb-4">
                    &ldquo;We run {studio.title} with standard union set protocols: pristine floors on call time, redundant power, and an on-site stage manager who knows how to problem solve without interrupting the director.&rdquo;
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                    {[
                      { label: "Response Rate", value: "99%", color: "text-success" },
                      { label: "Response Time", value: "< 15 mins", color: "text-foreground" },
                      { label: "Tenure", value: "6 Years", color: "text-foreground" },
                      { label: "Direct Mail", value: studio.ownerEmail, color: "text-foreground" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="text-[10px] uppercase font-semibold tracking-wider text-muted mb-0.5">{stat.label}</div>
                        <div className={cn("text-sm font-semibold truncate", stat.color)}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="gap-2">
                    <FiMessageSquare className="w-4 h-4" /> Message Host
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  Production Reviews &amp; Call Sheets
                </h2>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
                  <FiStar className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-bold text-foreground">{studio.rating.toFixed(2)}</span>
                  <span className="text-xs text-muted">/ 5.0 ({studio.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Rating breakdown bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-surface border border-border">
                {[
                  { label: "Cleanliness", score: 5.0 },
                  { label: "Equipment & Power", score: 4.9 },
                  { label: "Host Support", score: 5.0 },
                  { label: "Spec Accuracy", score: 5.0 },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{r.label}</span>
                      <span className="font-bold text-foreground">{r.score}</span>
                    </div>
                    <div className="h-1 rounded-full bg-elevated overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(r.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {studio.reviews.length > 0 ? (
                  studio.reviews.map((review, i) => (
                    <div key={i} className="p-5 rounded-[20px] bg-surface border border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-elevated shrink-0">
                          <Avatar
                            src={review.userAvatar}
                            name={review.userName}
                            size="md"
                            className="w-full h-full border-0"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{review.userName}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <FiStar
                                key={j}
                                className={cn("w-3 h-3", j < review.rating ? "text-accent fill-accent" : "text-muted")}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-muted">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-[20px] bg-surface border border-dashed border-border text-center">
                    <p className="text-muted text-sm">No verified reviews yet. Be the first to book this space.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Booking Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-[24px] bg-surface border border-border overflow-hidden shadow-card-hover">
              {/* Pricing header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-end justify-between mb-1">
                  <div>
                    <span className="text-xs uppercase font-semibold tracking-wider text-muted">Base Rate</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-heading text-4xl font-extrabold text-foreground">${studio.hourlyRate}</span>
                      <span className="text-sm text-muted">/ hr</span>
                    </div>
                  </div>
                  <Badge variant="success" dot className="text-xs">Available Today</Badge>
                </div>
                <div className="text-xs text-muted mt-1.5">
                  ${studio.securityDeposit} Security Deposit{" "}
                  <span className="text-muted/70">(fully refundable post-wrap inspection)</span>
                </div>
              </div>

              {/* Quick info */}
              <div className="p-5 space-y-3 border-b border-border">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                    <FiUsers className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Up to {studio.maxCapacity} people</div>
                    <div className="text-xs text-muted">Cast &amp; production crew</div>
                  </div>
                </div>
                {studio.instantBook && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                      <FiZap className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Instant Confirmation</div>
                      <div className="text-xs text-muted">No host approval required</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                    <FiCheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Free cancellation 48h prior</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-5">
                {isOwner ? (
                  <div className="text-center">
                    <p className="text-sm text-muted mb-3">This is your studio listing.</p>
                    <Button asChild variant="secondary" size="default" className="w-full">
                      <Link href={`/studios/edit/${studio._id}`}>Edit This Listing</Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-base"
                    onClick={() => setShowBookingModal(true)}
                  >
                    Book Workspace Now →
                  </Button>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5 text-success" />
                    Instant{" Confirmation"}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <FiCheckCircle className="w-3.5 h-3.5 text-success" />
                    Free cancel 48h prior
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-elevated/50 border border-border flex items-start gap-2 text-xs text-muted">
                  <span className="w-2 h-2 rounded-full bg-success mt-0.5 shrink-0" />
                  Have questions about load-in?{" "}
                  <button className="text-accent font-medium ml-1">Chat Host</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          studio={studio}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}

