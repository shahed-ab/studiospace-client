"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Booking, BookingStatus } from "@/types";
import { getMyBookings, cancelBooking } from "@/lib/api";
import { generateBookingInvoice } from "@/lib/invoice";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiDollarSign,
  FiExternalLink,
  FiXCircle,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
  FiHelpCircle,
} from "react-icons/fi";

const STATUS_FILTERS: Array<"All" | BookingStatus> = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | BookingStatus>("All");

  // Cancel booking modal state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      toast.error("Failed to load your production bookings");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    if (activeTab === "All") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = { All: bookings.length };
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    try {
      await cancelBooking(cancellingBooking._id);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancellingBooking._id ? { ...b, status: "Cancelled" } : b
        )
      );
      toast.success("Booking Cancelled", {
        description: `Your reservation for "${cancellingBooking.studioTitle}" on ${cancellingBooking.date} has been cancelled.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel booking";
      toast.error(msg);
    } finally {
      setCancellingBooking(null);
    }
  };

  const handleDownloadInvoice = (booking: Booking) => {
    try {
      const filename = generateBookingInvoice(booking);
      toast.success("Invoice Downloaded", {
        description: `Official invoice ${filename} has been saved to your downloads.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate invoice";
      toast.error("Download Failed", { description: msg });
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1.5 py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            Pending Host Approval
          </Badge>
        );
      case "Confirmed":
        return (
          <Badge variant="success" className="flex items-center gap-1.5 py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Confirmed &amp; Stage Locked
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="info" className="flex items-center gap-1.5 py-1 px-3">
            <FiCheckCircle className="w-3.5 h-3.5" />
            Wrapped &amp; Archived
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge variant="danger" className="flex items-center gap-1.5 py-1 px-3">
            <FiXCircle className="w-3.5 h-3.5" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-10 pb-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              PRODUCTION CALL SHEETS
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              My Production Bookings
            </h1>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Track your scheduled shoot days, active holds, digital check-in vouchers, and receipts.
            </p>
          </div>

          <Button asChild variant="primary" size="lg" className="self-start sm:self-center">
            <Link href="/studios">Explore More Spaces</Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 mb-8">
          {STATUS_FILTERS.map((tab) => {
            const count = countsByStatus[tab] || 0;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-accent/40"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-elevated text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-[24px] bg-surface border border-border animate-pulse flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="w-full md:w-48 aspect-[4/3] bg-elevated rounded-2xl" />
                <div className="flex-1 space-y-3 w-full">
                  <div className="w-1/3 h-5 bg-elevated rounded" />
                  <div className="w-1/2 h-4 bg-elevated rounded" />
                  <div className="w-1/4 h-4 bg-elevated rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={
                activeTab === "All"
                  ? "No Production Bookings Yet"
                  : `No ${activeTab} Bookings`
              }
              description={
                activeTab === "All"
                  ? "You have not reserved any studio workspaces yet. Discover certified photo lofts, film stages, and recording rooms ready for your call sheet."
                  : `You currently have zero bookings marked as ${activeTab.toLowerCase()}.`
              }
              actionText="Explore Available Studios"
              actionHref="/studios"
              icon={<FiCalendar className="w-8 h-8 text-accent" />}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-[24px] bg-surface border border-border overflow-hidden hover:border-accent/30 transition-all shadow-sm flex flex-col md:flex-row"
              >
                {/* Left: Studio Thumbnail */}
                <div className="relative w-full md:w-64 aspect-[16/10] md:aspect-auto shrink-0 bg-elevated">
                  <Image
                    src={booking.studioImage || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"}
                    alt={booking.studioTitle}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                  <div className="absolute bottom-3 left-3 md:hidden">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Center: Details Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
                          RESERVATION #{booking._id.slice(-6).toUpperCase()}
                        </span>
                        <h3 className="font-heading text-xl font-bold text-foreground">
                          {booking.studioTitle}
                        </h3>
                      </div>
                      <div className="hidden md:block">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Shoot Logistics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                      <div className="flex items-center gap-2.5 text-xs text-foreground/90">
                        <div className="w-7 h-7 rounded-lg bg-elevated border border-border flex items-center justify-center text-accent shrink-0">
                          <FiCalendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block">Shoot Date</span>
                          <span className="font-semibold">{booking.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-foreground/90">
                        <div className="w-7 h-7 rounded-lg bg-elevated border border-border flex items-center justify-center text-accent shrink-0">
                          <FiClock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block">Call Sheet Hours</span>
                          <span className="font-semibold">
                            {booking.startTime} &ndash; {booking.endTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-foreground/90">
                        <div className="w-7 h-7 rounded-lg bg-elevated border border-border flex items-center justify-center text-accent shrink-0">
                          <FiUser className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block">Host Stage Manager</span>
                          <span className="font-semibold truncate max-w-[140px] block">
                            {booking.ownerEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Price & Action Row */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                    <div>
                      <span className="text-xs text-muted">Total Paid / Escrow Amount:</span>
                      <div className="font-heading text-xl font-bold text-foreground">
                        ${booking.totalPrice.toLocaleString()}
                        <span className="text-xs text-muted font-normal ml-1">
                          (Cleaned &amp; Insured)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                        <Link href={`/studios/${booking.studioId}`}>
                          <FiExternalLink className="mr-1.5 w-3.5 h-3.5" />
                          View Stage
                        </Link>
                      </Button>

                      {/* Rule 12: Cancel option on Pending items only! */}
                      {booking.status === "Pending" && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => setCancellingBooking(booking)}
                        >
                          <FiXCircle className="mr-1.5 w-3.5 h-3.5" />
                          Cancel Booking
                        </Button>
                      )}

                      {booking.status === "Confirmed" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleDownloadInvoice(booking)}
                        >
                          <FiDownload className="mr-1.5 w-3.5 h-3.5" />
                          Download Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(cancellingBooking)}
          onClose={() => setCancellingBooking(null)}
          onConfirm={handleCancelConfirm}
          title="Cancel Production Booking?"
          description={`Are you sure you want to cancel your reservation for "${cancellingBooking?.studioTitle}" on ${cancellingBooking?.date} (${cancellingBooking?.startTime} – ${cancellingBooking?.endTime})? This will release the stage hold back to the public marketplace.`}
          confirmText="Yes, Cancel Booking"
          cancelText="Keep Booking"
          variant="danger"
        />
      </Container>
    </div>
  );
}
