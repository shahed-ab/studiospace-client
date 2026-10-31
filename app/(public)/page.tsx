"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { StudioCard } from "@/components/studios/StudioCard";
import { StudioGridSkeleton } from "@/components/shared/Skeletons";
import { getFeaturedStudios } from "@/lib/api";
import { Studio } from "@/types";
import { cn } from "@/lib/utils";
import {
  FiArrowRight,
  FiArrowLeft,
  FiSearch,
  FiMapPin,
  FiCamera,
  FiMonitor,
  FiMic,
  FiMusic,
  FiTool,
  FiUsers,
  FiStar,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiPlus,
  FiSettings,
} from "react-icons/fi";
import { RiFilmLine } from "react-icons/ri";

// ─── Hero Slides ───────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2400&q=85",
    eyebrow: "BACKSTAGE CREATIVE DIRECTORY",
    eyebrowSuffix: "· 48 New Spaces Added Today",
    heading1: "Find the space.",
    heading2: "Make the",
    heading3: "work.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=85",
    eyebrow: "PRODUCTION-GRADE STAGES",
    eyebrowSuffix: "· Vetted by Directors & DPs",
    heading1: "Shoot like a",
    heading2: "studio. Book",
    heading3: "instantly.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=2400&q=85",
    eyebrow: "SOUND & BROADCAST SUITES",
    eyebrowSuffix: "· NC-25 Certified Venues",
    heading1: "Record with",
    heading2: "precision.",
    heading3: "Broadcast live.",
  },
];

// ─── Category Cards ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "Photo Studios & Daylight Cycs",
    spaces: "520+ SPACES",
    desc: "High-key daylight, infinity cycloramas, and motorized overhead grids built for editorial and commercial photo campaigns.",
    href: "/studios?category=Photo+Studio",
    image:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
    icon: FiCamera,
    large: true,
  },
  {
    name: "Sound Stages & Film",
    spaces: "210+ SPACES",
    desc: "Union-spec soundstages with drive-in access, heavy camlock, and certified NC-25 acoustic isolation.",
    href: "/studios?category=Film+Stage",
    image:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    icon: RiFilmLine,
    large: false,
  },
  {
    name: "Podcast & Broadcast Rooms",
    spaces: "185+ SPACES",
    desc: "Turn-key multi-cam video podcast booths, radio-grade isolation, and livestream rigs.",
    href: "/studios?category=Podcast+Lounge",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    icon: FiMic,
    large: false,
  },
  {
    name: "Music Recording Suites",
    spaces: "160+ SPACES",
    desc: "Analog consoles, floating isolation floors, grand pianos, and outboard gear chains.",
    href: "/studios?category=Music+Suite",
    image:
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80",
    icon: FiMusic,
    large: false,
  },
  {
    name: "Art & Craft Workshops",
    spaces: "140+ SPACES",
    desc: "Ceramics, fabrication, printmaking, and mixed-media lofts with industrial equipment and natural daylight.",
    href: "/studios?category=Workshop",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    icon: FiTool,
    large: false,
  },
];

// ─── Steps ────────────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    num: "01",
    icon: FiSearch,
    title: "Discover Spaces",
    desc: "Search verified studios filtered by cyc dimensions, power specs, lighting packages, and exact ceiling heights.",
    tag: "Real-time availability",
  },
  {
    num: "02",
    icon: FiClock,
    title: "Select Shoot Hours",
    desc: "Book precise hourly blocks with straightforward daytime and overnight pricing. Zero multi-day lock-ins.",
    tag: "Transparent pricing",
  },
  {
    num: "03",
    icon: FiLock,
    title: "Book Instantly",
    desc: "Host confirmation with instant calendar lock backed by automated escrow protection and comprehensive digital receipts.",
    tag: "Escrow secured",
  },
  {
    num: "04",
    icon: FiMonitor,
    title: "Create & Produce",
    desc: "Access your set via contactless smart key entry, plug in your camera gear, and execute your vision uninterrupted.",
    tag: "Digital keyless check-in",
  },
];

// ─── Guarantees ────────────────────────────────────────────────────────────────
const GUARANTEES = [
  {
    icon: FiShield,
    title: "$1M Liability Coverage",
    desc: "Every production booking includes top-tier third-party bodily injury and property damage protection at zero extra cost to the host.",
  },
  {
    icon: FiUsers,
    title: "Verified Creator Profiles",
    desc: "Every production lead undergoes strict identity screening, company registration validation, and past host review history.",
  },
  {
    icon: FiTool,
    title: "Gear & Space Protection",
    desc: "In-house equipment, cyclorama walls, acoustic sound treatment, and heavy electrical rigging stay secure under our rapid claim protocols.",
  },
  {
    icon: FiSettings,
    title: "24/7 Production Concierge",
    desc: "Real human production managers on-call around the clock to troubleshoot load-in logistics, overtime extensions, and equipment queries.",
  },
];

// ─── Marquee Ticker ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "PHOTO STUDIOS",
  "CYCLORAMA WALLS",
  "SOUND STAGES",
  "PODCAST SUITES",
  "RECORDING ROOMS",
  "FILM STAGES",
  "ART WORKSHOPS",
  "MUSIC SUITES",
];

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loadingStudios, setLoadingStudios] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const sliderInterval = useRef<ReturnType<typeof setInterval>>();

  // Auto-advance slider
  useEffect(() => {
    sliderInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(sliderInterval.current);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    clearInterval(sliderInterval.current);
  };
  const prevSlide = () => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % HERO_SLIDES.length);

  // Load featured studios
  useEffect(() => {
    getFeaturedStudios()
      .then(setFeaturedStudios)
      .finally(() => setLoadingStudios(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery ? `/studios?query=${encodeURIComponent(searchQuery)}` : "/studios");
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO SLIDER ─────────────────────────────────────────────────── */}
      <section className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12">
        {/* Background Images */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              i === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={s.image}
              alt={`Studio slide ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85 pointer-events-none" />

        {/* Hero Content in Natural Flow */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Eyebrow pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/40 backdrop-blur-md border border-white/15 text-xs font-medium text-foreground/90 mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="font-semibold tracking-wider uppercase text-accent/90">
              {slide.eyebrow}
            </span>
            <span className="text-foreground/60">{slide.eyebrowSuffix}</span>
          </div>

          {/* Giant two-tone heading */}
          <h1 className="text-hero font-heading font-extrabold tracking-tight text-foreground mb-4 sm:mb-6 max-w-4xl">
            <span className="block">{slide.heading1}{" "}
              <span className="text-accent">{slide.heading2}</span>
            </span>
            <span className="block text-accent">{slide.heading3}</span>
          </h1>

          <p className="subtext-hero text-foreground/80 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            The curated marketplace connecting visionary filmmakers,
            photographers, and audio engineers with verified, union-spec production spaces.
          </p>

          {/* CTA Buttons - Full Width on Mobile, Side by Side on Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8">
            <Button asChild variant="primary" size="lg" className="w-full sm:w-[190px] justify-center">
              <Link href="/studios">
                Explore Studios
                <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-[190px] justify-center border-white/20 bg-white/10 hover:bg-white/20 text-foreground backdrop-blur-md">
              <Link href="/add-studio">
                Host Your Space
                <FiPlus className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Slide nav dots */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 transition-all"
              aria-label="Previous slide"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === currentSlide
                      ? "w-7 h-2 bg-accent"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white/20 transition-all"
              aria-label="Next slide"
            >
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Search Bar (In Natural Flow, Never Overlaps, 2x2 on Tablet, Compact List on Mobile) */}
          <div className="w-full max-w-5xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="glass-panel rounded-2xl p-3.5 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 shadow-2xl text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 p-2 sm:p-0">
                <FiMapPin className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">Location</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Brooklyn, NY or London"
                    className="bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="hidden lg:block w-px h-10 bg-border" />

              <div className="flex items-center gap-3 flex-1 min-w-0 p-2 sm:p-0">
                <FiCamera className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">Category</span>
                  <span className="text-sm text-muted">All Disciplines</span>
                </div>
              </div>

              <div className="hidden lg:block w-px h-10 bg-border" />

              <div className="flex items-center gap-3 flex-1 min-w-0 p-2 sm:p-0">
                <FiClock className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">Date &amp; Hours</span>
                  <span className="text-sm text-muted">Select day &amp; time</span>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full lg:w-auto shrink-0 px-6 sm:px-8 justify-center">
                <FiSearch className="mr-2 w-4 h-4" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR (Compact 1x3 Row on Mobile) ─────────────────────────── */}
      <div className="bg-surface border-b border-border py-4 sm:py-6">
        <Container>
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center text-center sm:text-left">
            {[
              { icon: FiSettings, value: "1,200+", label: "Verified Studios" },
              { icon: FiUsers, value: "8,500", label: "Active Directors" },
              { icon: FiStar, value: "4.98", label: "Creator Score" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-3.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-elevated border border-border flex items-center justify-center text-accent shrink-0">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-heading text-sm sm:text-lg md:text-xl font-bold text-foreground leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted truncate max-w-[90px] sm:max-w-none">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ─── MARQUEE TICKER ──────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-background border-b border-border py-4">
        <div className="flex items-center gap-10 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-muted">
              {item}
              <span className="text-accent text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── FEATURED STUDIOS ────────────────────────────────────────────── */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="CURATED SPACES"
            title="Featured Studios in High Demand"
            description="Architectural spaces engineered for flawless lighting, absolute acoustic separation, and frictionless production days."
            action={
              <Button asChild variant="ghost" className="gap-2 text-accent font-semibold hover:text-accent/80">
                <Link href="/studios">
                  View all 1,200+ studios
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            }
          />

          {loadingStudios ? (
            <StudioGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ─── BROWSE BY CATEGORY ──────────────────────────────────────────── */}
      <Section className="bg-surface border-y border-border">
        <Container>
          <SectionHeading
            eyebrow="EXPLORE DISCIPLINES"
            title="Designed for Every Creative Medium"
            description="Filter through specialized environments tailored with the exact infrastructure your production demands."
          />

          {/* Bento category grid */}
          {(() => {
            const CatIcon0 = CATEGORIES[0].icon;
            const CatIcon1 = CATEGORIES[1].icon;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* First large card spans 2 cols */}
                <Link
                  href={CATEGORIES[0].href}
                  className="sm:col-span-2 group relative rounded-[20px] overflow-hidden aspect-[16/9] block"
                >
                  <Image
                    src={CATEGORIES[0].image}
                    alt={CATEGORIES[0].name}
                    fill
                    sizes="(max-width:768px) 100vw, 66vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-full bg-elevated/80 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                          <CatIcon0 className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                          {CATEGORIES[0].spaces}
                        </span>
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-white">{CATEGORIES[0].name}</h3>
                      <p className="text-sm text-white/70 mt-1 max-w-sm leading-relaxed">{CATEGORIES[0].desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
                      <FiArrowRight className="w-5 h-5 text-white rotate-[-45deg]" />
                    </div>
                  </div>
                </Link>

                {/* Second card small */}
                <Link
                  href={CATEGORIES[1].href}
                  className="group relative rounded-[20px] overflow-hidden aspect-[4/3] block"
                >
                  <Image
                    src={CATEGORIES[1].image}
                    alt={CATEGORIES[1].name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CatIcon1 className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">{CATEGORIES[1].spaces}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white leading-tight">{CATEGORIES[1].name}</h3>
                  </div>
                  <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-elevated/60 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                    <FiArrowRight className="w-4 h-4 text-white rotate-[-45deg]" />
                  </div>
                </Link>

                {/* Bottom three smaller cards */}
                {CATEGORIES.slice(2).map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="group relative rounded-[20px] overflow-hidden aspect-[4/3] block"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      <div className="absolute bottom-5 left-5 right-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CatIcon className="w-4 h-4 text-accent" />
                          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">{cat.spaces}</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-white leading-tight">{cat.name}</h3>
                      </div>
                      <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-elevated/60 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                        <FiArrowRight className="w-4 h-4 text-white rotate-[-45deg]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })()}
        </Container>
      </Section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────── */}
      <Section className="bg-elevated/40">
        <Container>
          <SectionHeading
            eyebrow="SIMPLE WORKFLOW"
            title="From Concept to Set in Minutes"
            description="Skip endless email negotiations, opaque permits, and hidden cleaning fees. StudioSpace is built by working production managers for modern creative teams."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {HOW_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-[20px] bg-surface border border-border flex flex-col h-full hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="font-heading text-4xl font-extrabold text-accent/30 leading-none">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent">
                      <StepIcon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed flex-1">{step.desc}</p>

                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                    <FiCheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-xs text-muted">{step.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ─── HOST GUARANTEE ──────────────────────────────────────────────── */}
      <Section className="bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                PEACE OF MIND GUARANTEE
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
                Host Your Space with Total Confidence
              </h2>
              <p className="text-muted text-base leading-relaxed mb-8 max-w-lg">
                Whether you own a boutique daylight studio or an industrial soundstage, StudioSpace protects your investment. Every booking is covered under our production guarantee, with rigorously verified creative crews.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild variant="primary" size="lg">
                  <Link href="/add-studio">
                    Become a Host Today
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/how-it-works">Host Calculator</Link>
                </Button>
              </div>

              {/* Earnings callout */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border">
                <div className="w-11 h-11 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent shrink-0">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading text-xl font-bold text-foreground">$4,850/mo</span>
                  <p className="text-xs text-muted">Average earnings for active studio hosts</p>
                </div>
              </div>
            </div>

            {/* Right: 2×2 guarantee cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GUARANTEES.map((g) => {
                const GIcon = g.icon;
                return (
                  <div
                    key={g.title}
                    className="p-5 rounded-[20px] bg-surface border border-border h-full hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent mb-4">
                      <GIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading text-base font-bold text-foreground mb-2">{g.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">{g.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── CTA BANNER ──────────────────────────────────────────────────── */}
      <Section spacing="sm">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a1510] via-[#1a0e09] to-[#0e0a07] border border-accent/20 p-8 sm:p-14 md:p-20 text-center flex flex-col items-center">
            {/* Background glow behind icon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-accent/15 blur-3xl rounded-full pointer-events-none" />

            {/* Aperture icon */}
            <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent flex items-center justify-center shadow-xl shadow-accent/30 mb-6 sm:mb-8">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-9 sm:h-9">
                <line x1="20" y1="5" x2="20" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="31" x2="20" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="20" x2="9" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="31" y1="20" x2="35" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="20" cy="20" r="10.5" stroke="white" strokeWidth="2.2" strokeDasharray="4.2 3.5" />
                <circle cx="20" cy="20" r="3.2" fill="white" />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl">
              <h2 className="heading-h2 font-heading font-bold text-[#F4F1EA] tracking-tight mb-3 sm:mb-4">
                Your next shoot starts here.
              </h2>
              <p className="text-sm sm:text-base text-[#A09C94] max-w-xl mx-auto leading-relaxed mb-8">
                Join over 8,500 directors, photographers, and podcasters creating across the world&apos;s most inspiring private production spaces.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button asChild variant="primary" size="lg" className="w-full sm:w-[200px]">
                  <Link href="/studios">
                    Explore All Studios
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="w-full sm:w-[180px] bg-white/10 border border-white/20 text-[#F4F1EA] hover:bg-white/20 rounded-full">
                  <Link href="/add-studio">
                    List Your Studio
                    <FiPlus className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

