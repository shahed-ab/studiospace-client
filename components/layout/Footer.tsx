"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { FaXTwitter } from "react-icons/fa6";
import {
  RiInstagramLine,
  RiYoutubeLine,
  RiLinkedinBoxLine,
} from "react-icons/ri";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed to Backstage Dispatch!", {
      description: "Welcome aboard. You will receive private stage releases.",
    });
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#0E0E10] dark:bg-[#080809] border-t border-border mt-auto pt-10 md:pt-16 pb-8 md:pb-12 transition-colors">
      <Container>
        {/* Main Grid: On mobile, Brand & Newsletter at top, 2-column link grid below. On tablet md: 3-4 cols. On lg: 5 cols. */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-8 pb-8 md:pb-12 border-b border-border/60">
          {/* Brand info & Newsletter (Top on mobile, 2 columns on desktop) */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <Logo size="md" href="/" />
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm">
              Cinematic, union-grade creative spaces for directors, photographers, and audio engineers worldwide.
            </p>

            {/* Social Icons with Mandatory NEW X logo */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <RiInstagramLine className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <RiYoutubeLine className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <RiLinkedinBoxLine className="w-4 h-4" />
              </a>
            </div>

            {/* Newsletter Dispatch on Mobile (compact) */}
            <div className="pt-2 max-w-sm">
              <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">
                Backstage Dispatch
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your production email"
                  className="w-full h-9 pl-3.5 pr-20 text-xs rounded-full bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="absolute right-1 h-7 px-3 text-xs"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>

          {/* Link Groups: 2-column grid on mobile, 3-column on tablet, 3-column span on desktop */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-4 lg:pt-0">
            {/* Column 1: Studio Categories */}
            <div className="flex flex-col space-y-2.5">
              <h4 className="text-[11px] font-semibold text-foreground tracking-wider uppercase">
                Categories
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted">
                <li>
                  <Link href="/studios?category=Film+Stage" className="hover:text-foreground transition-colors">
                    Soundstages
                  </Link>
                </li>
                <li>
                  <Link href="/studios?category=Photo+Studio" className="hover:text-foreground transition-colors">
                    Daylight Cycs
                  </Link>
                </li>
                <li>
                  <Link href="/studios?category=Music+Suite" className="hover:text-foreground transition-colors">
                    Recording Suites
                  </Link>
                </li>
                <li>
                  <Link href="/studios?category=Workshop" className="hover:text-foreground transition-colors">
                    Art Workshops
                  </Link>
                </li>
                <li>
                  <Link href="/studios?category=Podcast+Lounge" className="hover:text-foreground transition-colors">
                    Podcast Booths
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="flex flex-col space-y-2.5">
              <h4 className="text-[11px] font-semibold text-foreground tracking-wider uppercase">
                Company
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Editorial &amp; Press
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Safety Rules
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Studio Grants
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Host Community (spans 2 cols on mobile, 1 col on sm+) */}
            <div className="col-span-2 sm:col-span-1 flex flex-col space-y-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <h4 className="text-[11px] font-semibold text-foreground tracking-wider uppercase">
                Host Community
              </h4>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm text-muted">
                <li>
                  <Link href="/add-studio" className="hover:text-foreground transition-colors font-medium text-accent">
                    List Your Studio +
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    Host Guarantee
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    Equipment Specs
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Host Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright & policies (Compact 1-2 lines) */}
        <div className="pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-muted text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} StudioSpace Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/about" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Security &amp; Escrow
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
