"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Logo, ApertureIcon } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FiArrowRight, FiCheck, FiStar, FiZap } from "react-icons/fi";

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <Container>
        {/* Top Header bar with Logo, ThemeToggle, and Phase Badge */}
        <div className="flex items-center justify-between py-6 border-b border-border mb-12">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            <Badge variant="accent" dot>
              Phase 1: Design System Ready
            </Badge>
            <div className="p-1 rounded-full bg-surface border border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Phase 1 Verification Hero */}
        <Section spacing="sm">
          <SectionHeading
            eyebrow="FOUNDATION COMPLETE"
            title={
              <>
                Crafted for creators.{" "}
                <span className="text-accent">Built with precision.</span>
              </>
            }
            description="Phase 1 setup complete: Next.js App Router, Tailwind tokens, Bricolage Grotesque & DM Sans typography, dark/light theme variables, Sonner toasts, and standard shared UI primitives."
            action={
              <Button
                variant="primary"
                onClick={() =>
                  toast.success("Design System Verification Passed!", {
                    description: "Sonner Toaster and theme tokens are working smoothly.",
                  })
                }
              >
                Trigger Test Toast
                <FiZap className="ml-2 w-4 h-4" />
              </Button>
            }
          />
        </Section>

        {/* Logo Assets Verification */}
        <Section spacing="sm">
          <SectionHeading
            eyebrow="BRAND ASSETS"
            title="Logo & Brand Components"
            description="High-resolution aperture squircle icon and wordmark extracted directly from Logo-Board.png and vectorized for sharp rendering at all viewports."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="surface" hover className="h-full">
              <CardHeader>
                <Badge variant="category" className="w-fit mb-2">Vector Component</Badge>
                <CardTitle>Dynamic Theme Logo</CardTitle>
                <CardDescription>
                  Vector SVG + Bricolage Grotesque typography with theme reactive colors.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6 bg-background/50 rounded-xl m-6 border border-border">
                <Logo size="lg" href="" />
              </CardContent>
            </Card>

            <Card variant="surface" hover className="h-full">
              <CardHeader>
                <Badge variant="category" className="w-fit mb-2">Public PNG Asset</Badge>
                <CardTitle>Dark Asset (/public)</CardTitle>
                <CardDescription>
                  Crisp 919×191 px extracted PNG for dark backgrounds.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6 bg-[#0B0B0C] rounded-xl m-6 border border-white/10">
                <div className="relative h-10 w-48">
                  <Image
                    src="/logo-dark.png"
                    alt="StudioSpace Dark Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            <Card variant="surface" hover className="h-full">
              <CardHeader>
                <Badge variant="category" className="w-fit mb-2">Public PNG Asset</Badge>
                <CardTitle>Light Asset (/public)</CardTitle>
                <CardDescription>
                  Crisp 919×191 px extracted PNG for light backgrounds.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6 bg-[#F6F3EC] rounded-xl m-6 border border-[#E6E0D4]">
                <div className="relative h-10 w-48">
                  <Image
                    src="/logo-light.png"
                    alt="StudioSpace Light Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Buttons Showcase */}
        <Section spacing="sm">
          <SectionHeading
            eyebrow="UI PRIMITIVES"
            title="Standard Button Variants"
            description="Strict adherence to Section 8 Rule 4: identical pill radius, 44px minimum tap target, subtle transitions, and hover glow."
          />

          <div className="p-8 rounded-[20px] bg-surface border border-border flex flex-wrap items-center gap-4">
            <Button variant="primary">
              Primary Action
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
            <Button variant="ghost">Ghost Action</Button>
            <Button variant="danger">Danger Action</Button>
            <Button variant="primary" size="sm">
              Small Pill
            </Button>
            <Button variant="primary" size="lg">
              Large Hero CTA
            </Button>
            <Button variant="secondary" size="icon" aria-label="Favorite button">
              <FiStar className="w-4 h-4 text-accent" />
            </Button>
          </div>
        </Section>

        {/* Badges Showcase */}
        <Section spacing="sm">
          <SectionHeading
            eyebrow="STATUS & TAGS"
            title="Pill Badges"
            description="Used for studio categories, availability, booking statuses (Pending, Confirmed, Cancelled), and spec callouts."
          />

          <div className="p-8 rounded-[20px] bg-surface border border-border flex flex-wrap items-center gap-3">
            <Badge variant="category">PHOTO STUDIO</Badge>
            <Badge variant="category">FILM STAGE</Badge>
            <Badge variant="category">PODCAST LOUNGE</Badge>
            <Badge variant="category">MUSIC SUITE</Badge>
            <Badge variant="category">WORKSHOP</Badge>
            <Badge variant="accent" dot>
              Featured Space
            </Badge>
            <Badge variant="success" dot>
              Confirmed
            </Badge>
            <Badge variant="warning" dot>
              Pending Approval
            </Badge>
            <Badge variant="danger" dot>
              Cancelled
            </Badge>
            <Badge variant="info">400A Camlock</Badge>
            <Badge variant="verified">
              <FiCheck className="w-3 h-3 text-[#5AA9FF]" /> Commercial Verified
            </Badge>
          </div>
        </Section>

        {/* Cards & Grid Rule Showcase */}
        <Section spacing="sm">
          <SectionHeading
            eyebrow="GRID ARCHITECTURE"
            title="Equal Height Cards"
            description="Strictly enforcing Section 8 Rule 8: All cards in a grid have equal width and equal height (h-full flex flex-col) with price and CTA pushed to bottom."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="category">DAYLIGHT PHOTO</Badge>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1">
                    <FiStar className="fill-accent text-accent w-3.5 h-3.5" /> 4.98 (142)
                  </span>
                </div>
                <CardTitle className="line-clamp-1">The Cyc Wall by Lumen</CardTitle>
                <p className="text-xs text-muted">Brooklyn, NY · Greenpoint</p>
                <CardDescription className="line-clamp-2 mt-2">
                  2,400 sq ft double corner cyclorama with 16ft grid height and private client mezzanine lounge.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div>
                  <span className="font-heading text-xl font-bold text-foreground">$85</span>
                  <span className="text-xs text-muted"> / hour</span>
                </div>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>

            <Card hover className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="category">SOUND STAGE</Badge>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1">
                    <FiStar className="fill-accent text-accent w-3.5 h-3.5" /> 4.99 (210)
                  </span>
                </div>
                <CardTitle className="line-clamp-1">Prism Stage A Soundstage</CardTitle>
                <p className="text-xs text-muted">Arts District, Los Angeles, CA</p>
                <CardDescription className="line-clamp-2 mt-2">
                  Certified NC-25 acoustic rating, 3-phase 400A camlock disconnect, roll-up bay door for direct grip truck drive-in.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div>
                  <span className="font-heading text-xl font-bold text-foreground">$140</span>
                  <span className="text-xs text-muted"> / hour</span>
                </div>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>

            <Card hover className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="category">PODCAST LOUNGE</Badge>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1">
                    <FiStar className="fill-accent text-accent w-3.5 h-3.5" /> 4.92 (67)
                  </span>
                </div>
                <CardTitle className="line-clamp-1">Echo Chamber Podcast Lounge</CardTitle>
                <p className="text-xs text-muted">South Congress, Austin, TX</p>
                <CardDescription className="line-clamp-2 mt-2">
                  Turnkey 4-person broadcast table with Blackmagic ATEM Mini Extreme switcher, 4K cameras, and live audio monitoring.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div>
                  <span className="font-heading text-xl font-bold text-foreground">$50</span>
                  <span className="text-xs text-muted"> / hour</span>
                </div>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>
      </Container>
    </main>
  );
}

