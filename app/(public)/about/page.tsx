import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiAward,
  FiUsers,
  FiCompass,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const STATS = [
  { value: "12,400+", label: "Shoots Produced", desc: "Commercials, music videos, and indie features staged." },
  { value: "$14.2M+", label: "Paid to Studio Hosts", desc: "Monetizing dark stage days directly into creator pockets." },
  { value: "580+", label: "Verified Soundstages & Lofts", desc: "Every stage pre-inspected for power, sound, and cyc curves." },
  { value: "99.4%", label: "Dispute-Free Wraps", desc: "Zero surprise cleaning fees or unapproved overtime charges." },
];

const VALUES = [
  {
    icon: FiAward,
    title: "Production Authenticity",
    desc: "We verify every single listing in person or through union-credentialed stage inspections. No misleading wide-angle photos or exaggerated ceiling heights.",
  },
  {
    icon: FiClock,
    title: "Creator Autonomy",
    desc: "Booking a world-class soundstage shouldn't require three weeks of email negotiations. We champion transparent hourly rates and instant holds.",
  },
  {
    icon: FiShield,
    title: "Host Security & Escrow",
    desc: "Every rental is protected with automated $2M liability coverage and neutral deposit escrow. Space owners get guaranteed payouts within 48 hours of wrap.",
  },
  {
    icon: FiUsers,
    title: "Community of Makers",
    desc: "From student film crews to Fortune 500 commercial shoots, we bridge independent venue owners with the most talented production crews in the world.",
  },
];

const TEAM = [
  {
    name: "Marcus Thorne",
    role: "Co-Founder & CEO",
    bio: "Former Line Producer and UPM at A24 and Warner Bros. Managed over 80 commercial and feature film shoots across North America.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Elena Rostova",
    role: "Co-Founder & Head of Operations",
    bio: "Stage Director & former sound engineer at Electric Lady Studios. Spearheads StudioSpace's physical venue inspections and power audits.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Devon Chen",
    role: "VP of Product & Engineering",
    bio: "Ex-Stripe marketplace infrastructure architect. Built the real-time calendar synchronization and escrow automation engines powering StudioSpace.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sarah Jenkins",
    role: "Head of Creator Relations",
    bio: "IATSE Local 600 Director of Photography. Dedicated to supporting emerging indie directors, photographers, and audio engineers with affordable access.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
];

const HUBS = [
  "New York City",
  "Los Angeles",
  "Atlanta",
  "London",
  "Vancouver",
  "Chicago",
  "Toronto",
  "Austin",
  "Berlin",
];

export default function AboutUsPage() {
  return (
    <div className="pb-20">
      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <Section className="relative overflow-hidden pt-12 pb-16 sm:py-20 border-b border-border bg-gradient-to-b from-surface/50 to-background">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              THE STUDIOSPACE MISSION
            </div>

            <h1 className="text-hero font-heading font-extrabold tracking-tight text-foreground mb-4 sm:mb-6">
              Built by Production Managers for the Next Generation of Makers
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
              We are building the marketplace infrastructure that connects private soundstages, daylight lofts, and recording suites with commercial directors, photographers, and independent production crews.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/studios">
                  Explore Verified Spaces
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/how-it-works">How Booking Works</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── HERO IMAGE ──────────────────────────────────────────────────── */}
      <Section spacing="sm">
        <Container>
          <div className="relative rounded-[28px] overflow-hidden aspect-[16/8] sm:aspect-[21/9] border border-border shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80"
              alt="Film production set with lighting grid and camera crew"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Badge variant="accent" className="mb-2">PRODUCTION STANDARDS</Badge>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  Stage A at Lumen Studios, Brooklyn
                </h3>
                <p className="text-xs sm:text-sm text-white/70">
                  Union soundstage with 22ft grid, 400A 3-phase camlock, and pre-rigged SkyPanels.
                </p>
              </div>
              <div className="text-xs text-white/60 font-mono">
                SHOT RECORD: 4K PRORES 4444 • 24 FPS
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── STORY & ORIGIN ──────────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                OUR ORIGIN
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight mb-6">
                Born on Real Film Sets, Built to Eliminate Production Friction
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-muted leading-relaxed">
                <p>
                  In 2021, our founders were line-producing a mid-budget commercial in New York. A last-minute location permit fell through 48 hours before call time. Finding an available soundstage with sufficient 3-phase power, high grid clearance, and union sound isolation required frantic phone calls, unreturned voicemails, and wire transfers sent with zero protection.
                </p>
                <p>
                  That shoot wrapped successfully, but the realization lingered: while cameras, lights, and post-production software had modernized dramatically, physical studio scouting was stuck in the 1990s.
                </p>
                <p>
                  We built StudioSpace to provide the digital infrastructure the creative industry deserves: clear transparent hourly pricing, verified power and acoustic specifications, instant holds, and automated escrow protection.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: FiCheckCircle,
                  title: "100% Verified Specs",
                  desc: "We verify electrical panel capacity, grid height, and sound isolation NC ratings so crews never walk into surprises.",
                },
                {
                  icon: FiShield,
                  title: "$2M Escrow Coverage",
                  desc: "Automated general liability coverage and security deposit escrow protection on every shoot day.",
                },
                {
                  icon: FiDollarSign,
                  title: "Transparent Rates",
                  desc: "Exact hourly pricing with no hidden multi-day mandates, surprise prep fees, or arbitrary cleaning markups.",
                },
                {
                  icon: FiCompass,
                  title: "Global Studio Network",
                  desc: "Curated stages across New York, Los Angeles, London, and 6 other major creative production capitals.",
                },
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={idx}
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

      {/* ─── STATS SECTION ───────────────────────────────────────────────── */}
      <Section className="bg-elevated/40 border-y border-border">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-[22px] bg-surface border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="font-heading text-4xl sm:text-5xl font-extrabold text-accent mb-2">
                    {s.value}
                  </div>
                  <h4 className="font-heading text-base font-bold text-foreground mb-1">
                    {s.label}
                  </h4>
                </div>
                <p className="text-xs text-muted leading-relaxed mt-4 pt-3 border-t border-border">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── CORE VALUES ─────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="OUR PRINCIPLES"
            title="The Values That Guide Every Stage We Verify"
            description="Our platform is designed around respect for both the craft of production crews and the physical investment of studio owners."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {VALUES.map((val, idx) => {
              const ValIcon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-[22px] bg-surface border border-border flex flex-col h-full hover:-translate-y-1 transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-accent mb-6 shadow-inner">
                    <ValIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed flex-1">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ─── LEADERSHIP TEAM ─────────────────────────────────────────────── */}
      <Section className="bg-elevated/20 border-t border-border">
        <Container>
          <SectionHeading
            eyebrow="LEADERSHIP"
            title="Built by Working Industry Veterans"
            description="Our executive team combines decades on studio floors with tier-one marketplace engineering."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {TEAM.map((person, idx) => (
              <div
                key={idx}
                className="rounded-[22px] bg-surface border border-border overflow-hidden flex flex-col h-full group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width:768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {person.name}
                    </h3>
                    <p className="text-xs font-semibold text-accent mb-3">{person.role}</p>
                    <p className="text-xs text-muted leading-relaxed mb-4">{person.bio}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                    <span className="w-7 h-7 rounded-lg bg-elevated border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors cursor-pointer">
                      <FaLinkedinIn className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-elevated border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors cursor-pointer">
                      <FaXTwitter className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── PRODUCTION HUBS ─────────────────────────────────────────────── */}
      <Section spacing="sm">
        <Container>
          <div className="p-8 sm:p-10 rounded-[28px] bg-surface border border-border text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
              ACTIVE PRODUCTION REGIONS
            </span>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
              StudioSpace Production Hubs Worldwide
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {HUBS.map((hub) => (
                <span
                  key={hub}
                  className="px-4 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-foreground/90 hover:border-accent/40 transition-colors"
                >
                  📍 {hub}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── CTA BANNER ──────────────────────────────────────────────────── */}
      <Section spacing="sm">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a1510] via-[#1a0e09] to-[#0e0a07] border border-accent/20 p-10 sm:p-16 text-center flex flex-col items-center">
            <h2 className="heading-h2 font-heading font-bold text-[#F4F1EA] mb-3 sm:mb-4">
              Join the StudioSpace Network
            </h2>
            <p className="text-[#A09C94] text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Whether you are an independent director locking stage time or a soundstage owner maximizing dark days, StudioSpace is your platform.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/studios">
                  Explore Studios
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/10 border border-white/20 text-[#F4F1EA] hover:bg-white/20 rounded-full"
              >
                <Link href="/add-studio">List Your Space</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

