"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Booking, Studio } from "@/types";
import {
  getMyBookings,
  getHostBookings,
  getMyStudios,
  updateBookingStatus,
  getDashboardStats,
  DashboardStats,
} from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import {
  FiPlus,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiCheck,
  FiX,
  FiExternalLink,
  FiStar,
  FiShield,
  FiCamera,
  FiSliders,
} from "react-icons/fi";

export default function DashboardPage() {
  const { user, toggleMockUser } = useAuth();
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [serverStats, setServerStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Decline request confirmation modal
  const [decliningBooking, setDecliningBooking] = useState<Booking | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const [hBookings, mBookings, userStudios, stats] = await Promise.all([
        getHostBookings(user.email),
        getMyBookings(user.email),
        getMyStudios(user.email),
        getDashboardStats().catch(() => null),
      ]);
      setHostBookings(hBookings);
      setMyBookings(mBookings);
      setStudios(userStudios);
      if (stats) setServerStats(stats);
    } catch {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Incoming pending requests requiring host action
  const pendingRequests = useMemo(() => {
    return hostBookings.filter((b) => b.status === "Pending");
  }, [hostBookings]);

  // Total confirmed earnings across all host bookings
  const totalEarnings = useMemo(() => {
    return hostBookings
      .filter((b) => b.status === "Confirmed" || b.status === "Completed")
      .reduce((sum, b) => sum + b.totalPrice, 0);
  }, [hostBookings]);

  const displayEarnings = serverStats?.earnings ?? totalEarnings;

  const handleConfirmRequest = async (booking: Booking) => {
    try {
      const updated = await updateBookingStatus(booking._id, "Confirmed");
      setHostBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? updated : b))
      );
      toast.success("Shoot Request Confirmed!", {
        description: `Calendar hold locked for ${booking.studioTitle} on ${booking.date}.`,
      });
    } catch {
      toast.error("Failed to confirm shoot request");
    }
  };

  const handleDeclineConfirm = async () => {
    if (!decliningBooking) return;
    try {
      const updated = await updateBookingStatus(decliningBooking._id, "Cancelled");
      setHostBookings((prev) =>
        prev.map((b) => (b._id === decliningBooking._id ? updated : b))
      );
      toast.info("Shoot Request Declined", {
        description: `The request for ${decliningBooking.studioTitle} on ${decliningBooking.date} has been released.`,
      });
    } catch {
      toast.error("Failed to decline request");
    } finally {
      setDecliningBooking(null);
    }
  };

  return (
    <div className="py-10 pb-24">
      <Container>
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-start sm:items-center gap-4">
            <Avatar
              src={user?.photoURL}
              name={user?.name}
              size="lg"
              className="w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl border-2 border-border/80 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  PRODUCTION COMMAND CENTER
                </div>

                {/* Demo user switch chip */}
                <button
                  type="button"
                  onClick={toggleMockUser}
                  className="text-xs px-3 py-1 rounded-full bg-surface border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <FiSliders className="w-3 h-3" />
                  Switch Demo User ({user?.name.split(" ")[0]})
                </button>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                Welcome back, {user?.name || "Creator"}
              </h1>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Performance overview across your active soundstages, crew requests, and scheduled call sheets.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/my-bookings">
                <FiCalendar className="mr-1.5 w-4 h-4" />
                My Bookings ({myBookings.length})
              </Link>
            </Button>
            <Button asChild variant="primary" className="gap-2">
              <Link href="/add-studio">
                <FiPlus className="w-4 h-4" />
                List a Studio
              </Link>
            </Button>
          </div>
        </div>

        {/* ─── 4 STAT CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-6 rounded-[22px] bg-surface border border-border flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Gross Escrow Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <FiDollarSign className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-foreground">
                ${displayEarnings.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-success font-medium mt-1.5">
                <FiTrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% vs previous 30 days</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[22px] bg-surface border border-border flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Active Listed Stages
              </span>
              <div className="w-9 h-9 rounded-xl bg-elevated text-foreground flex items-center justify-center">
                <FiCamera className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-foreground">
                {studios.length} Spaces
              </div>
              <p className="text-xs text-muted mt-1.5">
                {studios.length > 0 ? "100% verified & instant hold enabled" : "No live stages listed"}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[22px] bg-surface border border-border flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Total Production Shoots
              </span>
              <div className="w-9 h-9 rounded-xl bg-elevated text-foreground flex items-center justify-center">
                <FiCalendar className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-foreground">
                {hostBookings.length + myBookings.length} Bookings
              </div>
              <p className="text-xs text-muted mt-1.5">
                {hostBookings.filter((b) => b.status === "Confirmed").length} confirmed call sheets
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[22px] bg-surface border border-border flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Stage Safety Score
              </span>
              <div className="w-9 h-9 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
                <FiStar className="w-4.5 h-4.5 fill-warning" />
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-accent">
                4.98 / 5.0
              </div>
              <p className="text-xs text-muted mt-1.5">
                Top 2% Host Tier • &lt; 15m response
              </p>
            </div>
          </div>
        </div>

        {/* ─── SECTION: HOST BOOKING REQUESTS (WITH CONFIRM & DECLINE ACTIONS) ─── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <span>Incoming Shoot Requests</span>
                {pendingRequests.length > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {pendingRequests.length} Needs Review
                  </Badge>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-0.5">
                Production crews requesting calendar holds on your studio stages.
              </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/my-listings">Manage Stages</Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-surface border border-border animate-pulse h-24"
                />
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="p-8 rounded-[24px] bg-surface border border-border text-center">
              <div className="w-12 h-12 rounded-2xl bg-elevated flex items-center justify-center text-success mx-auto mb-3">
                <FiCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">
                All Shoot Requests Reviewed
              </h3>
              <p className="text-xs text-muted mt-1 max-w-md mx-auto">
                You have zero pending inquiries waiting for approval. New director and production company requests will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-5 sm:p-6 rounded-[22px] bg-surface border border-warning/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-elevated hidden sm:block">
                      <Image
                        src={request.studioImage}
                        alt={request.studioTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="warning" className="text-[10px]">
                          Pending Approval
                        </Badge>
                        <span className="text-xs font-mono text-muted">
                          #{request._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-foreground">
                        {request.studioTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1.5">
                        <span className="flex items-center gap-1 font-medium text-foreground/90">
                          <FiCalendar className="w-3.5 h-3.5 text-accent" />
                          {request.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          {request.startTime} – {request.endTime}
                        </span>
                        <span>•</span>
                        <span>Renter: <strong className="text-foreground">{request.userEmail}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Payout */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-muted block">Estimated Payout</span>
                      <span className="font-heading text-lg font-bold text-foreground">
                        ${request.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-success hover:bg-success/90 text-white border-none text-xs gap-1"
                        onClick={() => handleConfirmRequest(request)}
                      >
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                        Confirm Shoot
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={() => setDecliningBooking(request)}
                      >
                        <FiX className="w-3.5 h-3.5 stroke-[3]" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── SECTION: RECENT CONFIRMED CALL SHEETS ─── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Confirmed Upcoming Call Sheets
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-0.5">
                Approved production bookings locked into venue calendars.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/my-bookings">View Full History</Link>
            </Button>
          </div>

          {loading ? (
            <div className="p-8 rounded-2xl bg-surface border border-border animate-pulse h-32" />
          ) : hostBookings.filter((b) => b.status === "Confirmed").length === 0 ? (
            <div className="p-8 rounded-[24px] bg-surface border border-border text-center">
              <p className="text-xs text-muted">
                No upcoming confirmed shoots scheduled for the next 7 days.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hostBookings
                .filter((b) => b.status === "Confirmed")
                .slice(0, 4)
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="p-5 rounded-[22px] bg-surface border border-border flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="success" className="text-[10px]">
                          Confirmed
                        </Badge>
                        <span className="text-xs text-muted">
                          {booking.startTime} – {booking.endTime}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-foreground">
                        {booking.studioTitle}
                      </h4>
                      <p className="text-xs text-muted mt-1">
                        Date: <strong className="text-foreground">{booking.date}</strong> • Renter: {booking.userEmail}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-heading text-base font-bold text-foreground block">
                        ${booking.totalPrice.toLocaleString()}
                      </span>
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="text-xs text-accent hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        View Stage <FiExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Decline Request Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(decliningBooking)}
          onClose={() => setDecliningBooking(null)}
          onConfirm={handleDeclineConfirm}
          title="Decline Shoot Request?"
          description={`Are you sure you want to decline the request for "${decliningBooking?.studioTitle}" on ${decliningBooking?.date} from ${decliningBooking?.userEmail}? The stage hold will be cancelled.`}
          confirmText="Yes, Decline Request"
          cancelText="Keep Pending"
          variant="danger"
        />
      </Container>
    </div>
  );
}
