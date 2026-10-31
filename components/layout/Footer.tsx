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
    <footer className="w-full bg-[#0E0E10] dark:bg-[#080809] border-t border-border mt-auto pt-16 pb-12 transition-colors">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border/60">
          {/* Brand info (2 columns on desktop) */}
          <div className="lg:col-span-2 flex flex-col space-y-5">
            <Logo size="md" href="/" />
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Tactile, focused, and cinematic creative spaces for directors,
              photographers, audio engineers, and visual architects worldwide.
            </p>

            {/* Social Icons with Mandatory NEW X logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <RiInstagramLine className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <RiYoutubeLine className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <RiLinkedinBoxLine className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Studio Categories */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase">
              Studio Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link
                  href="/studios?category=Film+Stage"
                  className="hover:text-foreground transition-colors"
                >
                  Soundstages
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Photo+Studio"
                  className="hover:text-foreground transition-colors"
                >
                  Daylight Cycloramas
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Music+Suite"
                  className="hover:text-foreground transition-colors"
                >
                  Recording Suites
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Workshop"
                  className="hover:text-foreground transition-colors"
                >
                  Art & Craft Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Podcast+Lounge"
                  className="hover:text-foreground transition-colors"
                >
                  Podcast Suites
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col space-y-3.5">
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
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
                  Editorial & Press
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Careers & Studio Grant
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Host Community & Newsletter */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase">
              Host Community
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/add-studio" className="hover:text-foreground transition-colors">
                  List Your Studio
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  Host Guarantee
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  Production Equipment Specs
                </Link>
              </li>
            </ul>

            {/* Newsletter Dispatch */}
            <div className="pt-2">
              <p className="text-xs font-medium text-foreground mb-2">
                Backstage Dispatch
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full h-10 pl-3.5 pr-20 text-xs rounded-full bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="absolute right-1 h-8 px-3 text-xs"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright & policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>
            © 2025 StudioSpace Inc. Cinematic spaces for visionary productions. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

