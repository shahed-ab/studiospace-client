"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StudioCard } from "@/components/studios/StudioCard";
import { StudioGridSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStudios } from "@/lib/api";
import { Studio, StudioCategory } from "@/types";
import { cn } from "@/lib/utils";
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSliders,
} from "react-icons/fi";

const CATEGORIES: Array<{ label: string; value: StudioCategory | "All" }> = [
  { label: "All Disciplines", value: "All" },
  { label: "Photo Studio", value: "Photo Studio" },
  { label: "Film Stage", value: "Film Stage" },
  { label: "Podcast Lounge", value: "Podcast Lounge" },
  { label: "Music Suite", value: "Music Suite" },
  { label: "Workshop", value: "Workshop" },
];

const SORT_OPTIONS = [
  { label: "Top Rated & Verified", value: "top-rated" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
] as const;

const PRICE_OPTIONS = [
  { label: "Any Price", min: 0, max: 99999 },
  { label: "Under $75/hr", min: 0, max: 75 },
  { label: "$75 – $125/hr", min: 75, max: 125 },
  { label: "Over $125/hr", min: 125, max: 99999 },
];

const PAGE_SIZE = 9;

function ExploreStudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive state from URL
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "All";
  const sortBy = (searchParams.get("sort") || "top-rated") as "top-rated" | "price-asc" | "price-desc" | "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
  const maxPrice = parseInt(searchParams.get("maxPrice") || "99999", 10);

  const [studios, setStudios] = useState<Studio[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Local search input state (debounced then pushed to URL)
  const [searchInput, setSearchInput] = useState(query);

  const updateURL = useCallback((updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "All" || value === 0 || value === 99999) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    // Always reset to page 1 when filters change (except when explicitly setting page)
    if (!("page" in updates)) {
      params.delete("page");
    }
    router.push(`/studios?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Fetch studios whenever URL params change
  useEffect(() => {
    setLoading(true);
    getStudios({
      query,
      category: category === "All" ? undefined : category,
      sortBy,
      page,
      limit: PAGE_SIZE,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice < 99999 ? maxPrice : undefined,
    })
      .then(({ studios, total, totalPages }) => {
        setStudios(studios);
        setTotal(total);
        setTotalPages(totalPages);
      })
      .finally(() => setLoading(false));
  }, [query, category, sortBy, page, minPrice, maxPrice]);

  // Sync local input with URL query
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ query: searchInput });
  };

  const handleCategoryClick = (cat: string) => {
    updateURL({ category: cat === "All" ? undefined : cat });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateURL({ sort: e.target.value });
  };

  const handlePriceFilter = (min: number, max: number) => {
    updateURL({ minPrice: min || undefined, maxPrice: max < 99999 ? max : undefined });
  };

  const handleResetAll = () => {
    router.push("/studios");
    setSearchInput("");
  };

  const hasActiveFilters = query || category !== "All" || sortBy !== "top-rated" || minPrice > 0 || maxPrice < 99999;

  const priceLabel = minPrice > 0 || maxPrice < 99999
    ? `$${minPrice}–${maxPrice < 99999 ? "$" + maxPrice : "∞"} / hr`
    : null;

  return (
    <div className="min-h-screen pb-20">
      {/* ─── PAGE HEADER ─── */}
      <div className="bg-background pt-10 pb-4 border-b border-border">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                STUDIO DIRECTORY
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-3">
                Explore Creative Studios
              </h1>
              <p className="text-muted text-base max-w-lg leading-relaxed">
                Discover and book verified sound stages, daylight cycs, recording suites, and creative industrial lofts across top production hubs worldwide.
              </p>
            </div>
          </div>

          {/* ─── SEARCH BAR ─── */}
          <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by studio name, city, or category..."
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); updateURL({ query: undefined }); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-elevated flex items-center justify-center text-muted hover:text-foreground"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </div>
            <Button type="submit" variant="primary" size="default" className="px-6 shrink-0">
              <FiSearch className="mr-2 w-4 h-4" /> Find Studios
            </Button>
          </form>

          {/* ─── CATEGORY CHIPS ─── */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {CATEGORIES.map((cat) => {
              const isActive = (cat.value === "All" && category === "All") || cat.value === category;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                    isActive
                      ? "bg-accent text-white border-accent"
                      : "bg-surface text-muted border-border hover:border-accent/50 hover:text-foreground"
                  )}
                >
                  {cat.label}
                  {isActive && cat.value !== "All" && (
                    <FiX className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              );
            })}

            {/* Price filter */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-").map(Number);
                  handlePriceFilter(min, max);
                }}
                value={`${minPrice}-${maxPrice}`}
                className="appearance-none pl-3 pr-8 py-2 rounded-full text-sm font-medium bg-surface border border-border text-muted hover:border-accent/50 focus:outline-none focus:border-accent cursor-pointer transition-colors"
              >
                {PRICE_OPTIONS.map((p) => (
                  <option key={p.label} value={`${p.min}-${p.max}`}>{p.label}</option>
                ))}
              </select>
              <FiSliders className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
            </div>
          </div>

          {/* ─── SORT + RESULTS COUNT ─── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-muted uppercase font-semibold tracking-wider">Sort by</span>
              <select
                value={sortBy}
                onChange={handleSort}
                className="appearance-none pl-3 pr-8 py-2 rounded-full text-sm font-medium bg-surface border border-border text-foreground focus:outline-none focus:border-accent cursor-pointer transition-colors"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetAll}
                className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
              >
                <FiX className="w-3 h-3" /> Reset all filters
              </button>
            )}
          </div>

          {/* ─── ACTIVE FILTER PILLS ─── */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 py-3 border-t border-border">
              <span className="text-xs text-muted font-medium">
                {loading ? "..." : `${total} verified space${total !== 1 ? "s" : ""}`}
              </span>
              <span className="text-muted text-xs">•</span>
              {query && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 cursor-pointer hover:bg-elevated"
                  onClick={() => updateURL({ query: undefined })}
                >
                  &ldquo;{query}&rdquo; <FiX className="w-3 h-3" />
                </Badge>
              )}
              {category !== "All" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 cursor-pointer hover:bg-elevated"
                  onClick={() => updateURL({ category: undefined })}
                >
                  {category} <FiX className="w-3 h-3" />
                </Badge>
              )}
              {priceLabel && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 cursor-pointer hover:bg-elevated"
                  onClick={() => handlePriceFilter(0, 99999)}
                >
                  {priceLabel} <FiX className="w-3 h-3" />
                </Badge>
              )}
            </div>
          )}
          {!hasActiveFilters && !loading && (
            <div className="py-2 flex items-center gap-2">
              <span className="text-sm text-muted">{total} verified spaces</span>
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                {Math.floor(total * 0.75)} studios available for today&apos;s call sheets
              </span>
            </div>
          )}
        </Container>
      </div>

      {/* ─── STUDIO GRID ─── */}
      <Container className="pt-8">
        {loading ? (
          <StudioGridSkeleton count={PAGE_SIZE} />
        ) : studios.length === 0 ? (
          <EmptyState
            icon={<FiFilter className="w-8 h-8 text-accent" />}
            title="No studios match your criteria"
            description="Try adjusting your search terms, category filters, or price range to discover available production spaces."
            actionText="Reset All Filters"
            onAction={handleResetAll}
            secondaryActionText="Browse All Studios"
            onSecondaryAction={() => router.push("/studios")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>

            {/* ─── PAGINATION ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted">
                  Showing{" "}
                  <strong className="text-foreground">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
                  </strong>{" "}
                  of <strong className="text-foreground">{total}</strong> studio spaces
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={page <= 1}
                    onClick={() => updateURL({ page: page - 1 })}
                    aria-label="Previous page"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Page number buttons */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && page > 3) {
                        pageNum = page - 2 + i;
                        if (pageNum > totalPages) return null;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateURL({ page: pageNum })}
                          className={cn(
                            "w-9 h-9 rounded-full text-sm font-medium transition-colors",
                            pageNum === page
                              ? "bg-accent text-white"
                              : "bg-surface border border-border text-muted hover:border-accent/50 hover:text-foreground"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="text-muted px-1">...</span>
                        <button
                          onClick={() => updateURL({ page: totalPages })}
                          className="w-9 h-9 rounded-full text-sm font-medium bg-surface border border-border text-muted hover:border-accent/50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={page >= totalPages}
                    onClick={() => updateURL({ page: page + 1 })}
                    aria-label="Next page"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default function ExploreStudiosPage() {
  return (
    <Suspense
      fallback={
        <Container className="pt-24 pb-20">
          <StudioGridSkeleton count={9} />
        </Container>
      }
    >
      <ExploreStudiosContent />
    </Suspense>
  );
}

