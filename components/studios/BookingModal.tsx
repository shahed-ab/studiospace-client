"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Studio } from "@/types";
import { createBooking, checkBookingOverlap } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiAlertTriangle,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

// Time options in half-hour increments
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_OPTIONS.push(`${h.toString().padStart(2, "0")}:00`);
  if (h < 23) TIME_OPTIONS.push(`${h.toString().padStart(2, "0")}:30`);
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${(m || 0).toString().padStart(2, "0")} ${ampm}`;
}

export function BookingModal({ studio, isOpen, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [crewSize, setCrewSize] = useState(5);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [overlapError, setOverlapError] = useState("");

  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  const totalHours = Math.max(0, (endMins - startMins) / 60);
  const basePrice = totalHours * studio.hourlyRate;
  const sanitation = totalHours > 0 ? 75 : 0;
  const escrow = 35;
  const deposit = studio.securityDeposit;
  const totalDue = basePrice + sanitation + escrow + deposit;

  const validateTimes = () => {
    if (endMins <= startMins) {
      setTimeError("End time must be after start time.");
      return false;
    }
    if (totalHours < 1) {
      setTimeError("Minimum booking is 1 hour.");
      return false;
    }
    setTimeError("");
    return true;
  };

  const handleCheckOverlap = async () => {
    if (!validateTimes()) return;
    setOverlapError("");

    const { hasOverlap, conflictingBooking } = await checkBookingOverlap(
      studio._id, date, startTime, endTime
    );

    if (hasOverlap && conflictingBooking) {
      setOverlapError(
        `This slot overlaps an existing booking from ${conflictingBooking.startTime}–${conflictingBooking.endTime}. Please choose a different time.`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to make a booking.");
      return;
    }

    if (!validateTimes()) return;
    setIsSubmitting(true);

    try {
      const noOverlap = await handleCheckOverlap();
      if (!noOverlap) {
        setIsSubmitting(false);
        return;
      }

      await createBooking({
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage: studio.images[0],
        userEmail: user.email,
        userName: user.name,
        ownerEmail: studio.ownerEmail,
        date,
        startTime,
        endTime,
        totalHours,
        totalPrice: totalDue,
        specialRequests,
      });

      toast.success("Booking Request Submitted!", {
        description: `${studio.title} · ${date} · ${formatTime(startTime)} – ${formatTime(endTime)}. Status: Pending confirmation.`,
      });

      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Booking failed. Please try again.";
      toast.error("Booking Failed", { description: message });
      if (message.includes("overlap") || message.includes("Slot")) {
        setOverlapError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Workspace Now</DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-foreground">{studio.title}</span>
            {" · "}{studio.location}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              <FiCalendar className="inline w-3.5 h-3.5 mr-1.5 text-accent" />
              Date Selected
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => { setDate(e.target.value); setOverlapError(""); }}
              required
              className="w-full h-11 px-4 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Time Block */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                <FiClock className="inline w-3.5 h-3.5 mr-1.5 text-accent" />
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value); setTimeError(""); setOverlapError(""); }}
                className="w-full h-11 px-4 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent cursor-pointer transition-colors"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{formatTime(t)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => { setEndTime(e.target.value); setTimeError(""); setOverlapError(""); }}
                className="w-full h-11 px-4 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent cursor-pointer transition-colors"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{formatTime(t)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time validation error */}
          {timeError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
              <FiAlertTriangle className="w-4 h-4 shrink-0" />
              {timeError}
            </div>
          )}

          {/* Crew size */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              <FiUsers className="inline w-3.5 h-3.5 mr-1.5 text-accent" />
              Cast &amp; Crew Size{" "}
              <span className="text-muted normal-case font-normal">
                (Under {studio.maxCapacity} cap)
              </span>
            </label>
            <input
              type="number"
              value={crewSize}
              onChange={(e) => setCrewSize(parseInt(e.target.value) || 1)}
              min={1}
              max={studio.maxCapacity}
              className="w-full h-11 px-4 rounded-xl bg-elevated border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Special Requests (optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Load-in time, equipment needs, client hospitality..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent resize-none transition-colors"
            />
          </div>

          {/* Overlap error */}
          {overlapError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{overlapError}</span>
            </div>
          )}

          {/* Price Breakdown */}
          {totalHours > 0 && !timeError && (
            <div className="rounded-[20px] bg-elevated border border-border p-5 space-y-3">
              <h4 className="text-sm font-semibold text-foreground mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>{totalHours} hour{totalHours !== 1 ? "s" : ""} × ${studio.hourlyRate}/hr standard</span>
                  <span className="text-foreground">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Studio Sanitation &amp; Turnover Fee</span>
                  <span className="text-foreground">${sanitation.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>StudioSpace Protection Escrow</span>
                  <span className="text-foreground">${escrow.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Refundable Damage Deposit</span>
                  <span className="text-foreground">${deposit.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between font-bold text-base">
                  <span className="text-foreground">Total Due</span>
                  <span className="text-accent text-xl">${totalDue.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-muted">${deposit.toFixed(2)} deposit released in 48h after your shoot.</p>
            </div>
          )}

          {/* Trust signals */}
          <div className="flex flex-wrap gap-3">
            {studio.instantBook && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <FiZap className="w-3.5 h-3.5" /> Instant Confirmation
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <FiCheckCircle className="w-3.5 h-3.5 text-success" /> Free cancellation 48h prior
            </span>
          </div>

          <DialogFooter className="gap-3 border-t-0 mt-0 pt-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !user}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isSubmitting ? "Submitting..." : "Book Workspace Now →"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

