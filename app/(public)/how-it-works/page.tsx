"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FiSearch,
  FiCalendar,
  FiCheckCircle,
  FiShield,
  FiDollarSign,
  FiClock,
  FiSliders,
  FiLock,
  FiArrowRight,
  FiChevronDown,
  FiKey,
  FiCamera,
  FiAward,
} from "react-icons/fi";

const CREATOR_STEPS = [
  {
    step: "01",
    icon: FiSearch,
    title: "Filter by Exact Production Specs",
    desc: "Search verified spaces filtered by cyc wall curvature, 3-phase camlock power, NC-25 sound isolation, and drive-in elephant doors.",
    highlight: "Union-spec verified",
  },
  {
    step: "02",
    icon: FiCalendar,
    title: "Lock Your Call Sheet Hours",
    desc: "Book precise blocks with instant calendar holds. Daytime, split-shift, and overnight rates with guaranteed zero multi-day lock-ins.",
    highlight: "Real-time calendar lock",
  },
  {
    step: "03",
    icon: FiKey,
    title: "Seamless Smart Check-in",
    desc: "Arrive on call time with digital keypad access, pre-inspected equipment catalogs, and a designated on-site stage manager.",
    highlight: "Keypad & manager on set",
  },
  {
    step: "04",
    icon: FiShield,
    title: "Wrap & Escrow Protection",
    desc: "Complete your shoot with confidence. Security deposits remain protected in neutral escrow and release automatically 24 hours post-wrap.",
    highlight: "$2M liability escrow",
  },
];

const HOST_STEPS = [
  {
    step: "01",
    icon: FiCamera,
    title: "List Your Creative Space",
    desc: "Publish your studio specs, floorplans, power distribution charts, lighting grip packages, and house guidelines in under 10 minutes.",
    highlight: "Free verified listing",
  },
  {
    step: "02",
    icon: FiSliders,
    title: "Set Your Rates & Union Rules",
    desc: "Define your base hourly fees, security deposit amounts, maximum crew limits, overtime surcharges, and sound isolation rules.",
    highlight: "100% schedule autonomy",
  },
  {
    step: "03",
    icon: FiLock,
    title: "Accept Verified Production Crews",
    desc: "Review incoming director and production company requests with verified credentials, valid COIs, and complete crew headcounts.",
    highlight: "Vetted crews only",
  },
  {
    step: "04",
    icon: FiDollarSign,
    title: "Guaranteed Direct Payouts",
    desc: "Receive automated payouts directly to your production bank account within 48 hours of shoot completion with full tax reporting.",
    highlight: "48-hour automated payout",
  },
];

const FAQS = [
  {
    q: "How does the StudioSpace $2M Production Escrow work?",
    a: "Every booking processed through StudioSpace automatically includes our comprehensive escrow protection. The renter's deposit and hourly payment are held securely by our escrow facility and are only disbursed to the host after wrap verification, safeguarding both crew and space against damages or unauthorized overtime disputes.",
  },
  {
    q: "Can I book soundstages and recording suites for overnight shoots?",
    a: "Yes. StudioSpace supports 24/7 shoot schedules. When selecting your hours in the booking modal, choose your start time and wrap time. Overnight hours and split-shift bookings will be clearly itemized without hidden overnight penalty fees.",
  },
  {
    q: "What happens if a shoot wraps early or runs into overtime?",
    a: "Early wrap is subject to the booked minimum hours. If your production requires overtime, you can request an extension directly through your dashboard with the on-site host. Overtime rates are billed per half-hour at the agreed transparent rate.",
  },
  {
    q: "Do I need a commercial Certificate of Insurance (COI)?",
    a: "For smaller photo sessions and podcast recordings, our built-in coverage is sufficient. For major union soundstages, grip-heavy commercial film productions, or shoots with pyrotechnics/stunts, an uploaded third-party COI naming the studio host as additional insured is required before call time.",
  },
  {
    q: "How do cancellations work for creators and hosts?",
    a: "Bookings cancelled 48 hours or more before the scheduled call time receive a 100% refund of the hourly rate and security deposit. Cancellations within 24-48 hours receive a 50% refund, while cancellations under 24 hours forfeit the base fee to compensate the studio for lost stage time.",
  },
  {
    q: "How do studio hosts receive payment?",
    a: "Payouts are transferred via direct ACH or wire transfer 48 hours following the conclusion of the booking. Hosts receive an itemized digital remittance report detailing base rates, sanitation fees, and any approved overtime charges.",
  },
];

const CATEGORY_RATES: Record<string, { label: string; rate: number }> = {
  photo: { label: "Daylight Photo Loft", rate: 125 },
  film: { label: "Union Soundstage & Film Lot", rate: 320 },
  podcast: { label: "Broadcast & Video Podcast Booth", rate: 85 },
  music: { label: "Analog Music Recording Suite", rate: 140 },
  workshop: { label: "Art & Fabrication Loft", rate: 95 },
};

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"creators" | "hosts">("creators");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculator state
  const [calcCategory, setCalcCategory] = useState("photo");
  const [calcHours, setCalcHours] = useState(35);

  const hourlyRate = CATEGORY_RATES[calcCategory]?.rate || 125;
  const monthlyEarnings = hourlyRate * calcHours;
  const annualEarnings = monthlyEarnings * 12;

  return (
    <div className="pb-20">
      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <Section className="relative overflow-hidden pt-12 pb-16 sm:py-20 border-b border-border bg-gradient-to-b from-surface/50 to-background">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              THE PRODUCTION SYSTEM
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.15] tracking-tight mb-6">
              How StudioSpace Powers World-Class Productions
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              From scouting verified soundstages to securing instant holds and automated escrow protection, here is how modern creators book spaces and how hosts run lucrative venues.
            </p>

            {/* Audience Toggle Pills */}
            <div className="inline-flex p-1.5 rounded-full bg-surface border border-border mb-8 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveTab("creators")}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "creators"
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-muted hover:text-foreground"
                }`}
              >
                For Directors &amp; Creative Crews
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hosts")}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "hosts"
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-muted hover:text-foreground"
                }`}
              >
                For Studio Owners &amp; Stage Managers
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/studios">
                  Explore Verified Studios
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/add-studio">List Your Creative Space</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── STEP BY STEP WORKFLOW ────────────────────────────────────────── */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow={activeTab === "creators" ? "CREW WORKFLOW" : "HOST WORKFLOW"}
            title={
              activeTab === "creators"
                ? "Four Simple Steps from Scouting to Wrap"
                : "Monetize Your Soundstage with Zero Friction"
            }
            description={
              activeTab === "creators"
                ? "Skip weeks of location scouting, opaque permits, and surprise fees. Book pre-vetted production stages directly from working hosts."
                : "Fill dark days between commercial shoots with verified directors, podcasters, and photography teams covered under our production guarantee."
            }
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {(activeTab === "creators" ? CREATOR_STEPS : HOST_STEPS).map((s) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-6 sm:p-7 rounded-[24px] bg-surface border border-border flex flex-col h-full hover:-translate-y-1 transition-transform group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-heading text-4xl font-extrabold text-accent/25 group-hover:text-accent transition-colors">
                      {s.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-accent shadow-inner">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed flex-1">
                    {s.desc}
                  </p>

                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                    <FiCheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-xs font-medium text-foreground/80">{s.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ─── PRODUCTION GUARANTEE & PROTECTION MATRIX ─────────────────────── */}
      <Section className="bg-elevated/40 border-y border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                PRODUCTION STANDARDS
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight mb-5">
                Engineered for Union Specs &amp; Strict Call Sheets
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
                Unlike generic peer-to-peer rental portals, StudioSpace is built around actual motion picture and commercial photography standards. We mandate clean electrical service, certified decibel isolation, and rigorous insurance protocols.
              </p>

              <div className="space-y-3">
                {[
                  "Automated instant Certificates of Insurance (COI)",
                  "Dedicated 3-phase camlock 100A-400A power distribution",
                  "NC-25 or quieter certified acoustic room ratings",
                  "Smart lock & lockbox protocols for 24/7 crew call times",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                    <FiCheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 2x2 grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: FiShield,
                  title: "$2M Escrow & Liability",
                  desc: "Comprehensive general liability coverage and security deposit protection held neutrally until wrap verification.",
                },
                {
                  icon: FiClock,
                  title: "Accurate Hourly Billing",
                  desc: "Zero rounded overtime gouging. Overtime and early prep hours are billed strictly in 30-minute increments.",
                },
                {
                  icon: FiAward,
                  title: "Sanitation & Pre-set Check",
                  desc: "Studios guarantee freshly painted cyc floors, sanitized staging rooms, and verified HVAC on crew call time.",
                },
                {
                  icon: FiKey,
                  title: "Host & Creator Dispute Resolution",
                  desc: "Our 24/7 dedicated production liaison team steps in instantly on any gear, power, or access disagreement.",
                },
              ].map((card, i) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-[22px] bg-surface border border-border h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent mb-4">
                        <CardIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading text-base font-bold text-foreground mb-2">
                        {card.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── INTERACTIVE HOST EARNINGS CALCULATOR ──────────────────────────── */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto rounded-[28px] bg-surface border border-border p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <Badge variant="accent" className="mb-3">
                HOST EARNINGS CALCULATOR
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Estimate Your Studio&apos;s Monthly Revenue
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2">
                See what hosts are earning by monetizing open studio days with certified crews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
              {/* Controls */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">
                    Select Your Space Discipline:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(CATEGORY_RATES).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCalcCategory(key)}
                        className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                          calcCategory === key
                            ? "bg-elevated border-accent text-foreground shadow-sm"
                            : "bg-surface border-border text-muted hover:border-border hover:text-foreground"
                        }`}
                      >
                        <span className="truncate pr-2">{val.label}</span>
                        <span className="font-bold text-accent shrink-0">${val.rate}/hr</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                    <span>Projected Booked Hours / Month:</span>
                    <span className="font-heading text-base text-accent font-bold">
                      {calcHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>10 hrs (Part-time)</span>
                    <span>50 hrs (Standard)</span>
                    <span>100 hrs (Full production)</span>
                  </div>
                </div>
              </div>

              {/* Earnings output */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-elevated border border-border text-center flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Estimated Monthly Earnings
                  </span>
                  <div className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight my-2">
                    ${monthlyEarnings.toLocaleString()}
                  </div>
                  <span className="text-xs text-success font-medium inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                    ~${annualEarnings.toLocaleString()}/yr projected
                  </span>
                  <p className="text-[11px] text-muted mt-3 leading-relaxed">
                    Based on market average booking rates for verified spaces in major production hubs.
                  </p>
                </div>

                <Button asChild variant="primary" className="w-full mt-6">
                  <Link href="/add-studio">
                    List Your Space Now
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── FAQ ACCORDION ────────────────────────────────────────────────── */}
      <Section className="bg-elevated/20 border-t border-border">
        <Container>
          <SectionHeading
            eyebrow="PRODUCTION QUESTIONS"
            title="Frequently Asked Questions"
            description="Clear answers about crew insurance, deposit hold durations, overtime policies, and keycard check-in."
            align="center"
          />

          <div className="max-w-3xl mx-auto mt-10 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface border border-border overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-foreground text-sm sm:text-base hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    <FiChevronDown
                      className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ─── BOTTOM CTA BANNER ────────────────────────────────────────────── */}
      <Section spacing="sm">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a1510] via-[#1a0e09] to-[#0e0a07] border border-accent/20 p-10 sm:p-16 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-xl shadow-accent/30 mb-6">
              <FiCamera className="w-7 h-7 text-white" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F1EA] mb-4">
              Ready to Stage Your Next Project?
            </h2>
            <p className="text-[#A09C94] text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Find union-verified soundstages, photography lofts, and podcast lounges ready for call time today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/studios">
                  Explore All Studios
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/10 border border-white/20 text-[#F4F1EA] hover:bg-white/20 rounded-full"
              >
                <Link href="/add-studio">Host a Studio</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

