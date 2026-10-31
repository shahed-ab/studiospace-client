import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FiHome, FiSearch, FiFilm, FiArrowRight } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Production Clapperboard Graphic */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            {/* Background ambient glow */}
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />

            <div className="relative w-20 h-20 rounded-3xl bg-surface border-2 border-accent/40 flex items-center justify-center shadow-xl shadow-accent/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-accent"
              >
                {/* Clapperboard SVG */}
                <rect width="20" height="16" x="2" y="4" rx="3" />
                <path d="m2 8 20 0" />
                <path d="m6 4 3 4" />
                <path d="m11 4 3 4" />
                <path d="m16 4 3 4" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>
          </div>

          {/* Large 404 display */}
          <div className="font-heading text-7xl sm:text-8xl md:text-9xl font-black text-accent tracking-tighter leading-none mb-3 select-none">
            404
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-elevated border border-border text-xs font-semibold text-muted mb-4 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            CUT! SCENE NOT FOUND • TAKE 404
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            This Studio Stage Has Wrapped
          </h1>

          <p className="text-muted text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
            The call sheet, private studio, or production route you were looking for doesn&apos;t exist, has been archived, or was moved to another studio lot.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button asChild variant="primary" size="lg" className="min-w-[190px]">
              <Link href="/">
                <FiHome className="mr-2 w-4 h-4" />
                Return to Set (Home)
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="min-w-[190px]">
              <Link href="/studios">
                <FiSearch className="mr-2 w-4 h-4" />
                Explore Available Stages
              </Link>
            </Button>
          </div>

          {/* Quick production navigation shortcuts */}
          <div className="pt-8 border-t border-border">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-3">
              Explore Active Production Categories
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "Photo Studios", href: "/studios?category=Photo+Studio" },
                { label: "Film Stages", href: "/studios?category=Film+Stage" },
                { label: "Podcast Booths", href: "/studios?category=Podcast+Lounge" },
                { label: "Music Suites", href: "/studios?category=Music+Suite" },
                { label: "Art Workshops", href: "/studios?category=Workshop" },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-foreground/80 hover:text-accent hover:border-accent transition-colors flex items-center gap-1.5"
                >
                  <FiFilm className="w-3 h-3 text-muted" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

