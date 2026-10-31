# StudioSpace — Project Context (v2)

StudioSpace is a premium peer-to-peer marketplace for renting creative studios: photo studios, film stages, podcast lounges, music suites, and art workshops. Hosts list spaces. Creators discover, filter, and book hourly slots with transparent pricing.

**Read this whole file at the start of EVERY task.** If a task conflicts with this file, tell me before doing it.

**Quality bar:** this must look and feel like a real, polished, production-grade product, not a student demo. Pixel-match the designs, keep behavior smooth, and leave no rough edges (no broken layouts, no console errors, no placeholder text).

---

## 1. Folders and scope

- This folder (`studiospace-client`) is the Next.js frontend and its own git repo. Work ONLY inside it.
- `/design` (inside this folder) holds the exported Figma page images and logo files. It is reference material, never part of the app.
- The backend is a separate folder (`studiospace-server`) outside this one. NEVER touch it.

### Current phase: FRONTEND ONLY

- Build every page with TypeScript, using **mock data** and a **mock logged-in user** (easy to switch on and off).
- No real authentication and no real API calls yet.
- Keep ALL data access behind one layer (`/lib/api.ts` plus `/data`), with async functions such as `getStudios()`, `getStudioById(id)`, `createStudio()`, `updateStudio()`, `deleteStudio()`, `getMyStudios()`, `createBooking()`, `getMyBookings()`, `cancelBooking()`. Pages must call only these functions. Later I will replace the insides with real fetch calls and nothing else should need to change.
- Simulate network delay (400-800 ms) inside those functions so skeleton loaders are visible and testable.
- Keep the mock auth in one place (`/lib/auth.ts` plus an `AuthProvider`/`useAuth()` hook exposing `user`, `isLoading`, `login`, `register`, `logout`). Later BetterAuth replaces its internals only.

---

## 2. Tech stack

**Frontend (this folder):** Next.js (App Router), TypeScript (strict), Tailwind CSS, shadcn/ui, Sonner (toasts), next-themes, Swiper, lucide-react, react-icons, react-hook-form + zod (forms and validation).

**Auth (later):** BetterAuth (email/password + Google OAuth) with MongoDB adapter.

**Backend (later, other folder):** Node.js + JavaScript (NOT TypeScript), Express.js, MongoDB with Mongoose, JWT in HTTPOnly cookies to protect private API routes, cookie-parser, cors.

Rules: no extra heavy libraries without asking. Prefer server components where possible and client components only where interaction is needed.

---

## 3. Roles

- Regular user: adds, edits, and deletes their OWN studios, and books other people's studios.
- Admin (optional, later): can edit or delete any studio.
- Hosts see booking requests for their studios (Confirm / Decline) on the Dashboard.

---

## 4. Design system

Dark-first "Backstage" look with a light-mode toggle. Cinematic, editorial, photography-led. **Match the screenshots in `/design` as closely as possible** (layout, spacing, proportions, colors, fonts, icons). When a screenshot and this file disagree on a visual detail, follow the screenshot.

**Colors (dark, default):** background `#0B0B0C`, surface `#151518`, elevated `#1D1D22`, border `rgba(255,255,255,0.08)`, text `#F4F1EA`, muted `#A09C94`, accent `#FF5B2E`, accent glow `rgba(255,91,46,0.25)`.
**Colors (light):** background `#F6F3EC`, surface `#FFFFFF`, text `#111111`, muted `#6B675F`, border `#E6E0D4`, same accent.
**Status colors:** success `#3DDC97`, warning `#FFB84D`, info `#5AA9FF`, danger `#FF5C5C`.

Define all colors as CSS variables in `globals.css` for both themes and map them in Tailwind/shadcn tokens. Never hardcode hex values in components.

**Fonts:** Bricolage Grotesque (headings), DM Sans (body), loaded with `next/font`.
**Shape and effects:** pill buttons and badges, 20px card radius, subtle 1px borders, soft orange glow on hover, glass blur on the navbar and floating panels, smooth hover lift on cards, tasteful transitions (150-250 ms).
**Logo:** aperture icon in a rounded square plus "StudioSpace" wordmark. Files are in `/design`. Copy them to `/public`. Use identical logo size and style in navbar and footer.

---

## 5. Design file map (all in `/design`)

| Page | Route | Design file |
|---|---|---|
| Home | `/` | `Creative Studio Rental Marketplace.png` |
| Explore Studios | `/studios` | `Explore Creative Studios.png` |
| Studio Details | `/studios/[id]` | `Studio-Details.png` |
| Login | `/login` | `Login page.png` |
| Register | `/register` | `Register page.png` |
| How It Works | `/how-it-works` | `How It Works.png` |
| About Us | `/about` | `About-Us.png` |
| Dashboard | `/dashboard` | `Host & Creator Dashboard.png` |
| Add New Studio | `/add-studio` | `Add-New-Studio.png` |
| My Studio Listings | `/my-listings` | `My Studio Listings.png` |
| Update Studio | `/studios/edit/[id]` | `Update-Studio.png` |
| My Bookings | `/my-bookings` | `My-Bookings.png` |
| 404 | `not-found.tsx` | `404 Scene Not Found.png` |
| Logo and design tokens | n/a | `Logo-Board.png` |

If a file cannot be opened because of spaces in its name, rename a copy (for example `login.png`) and tell me.

No design exists for these, so build them to match the design system: booking modal, delete confirmation modal, cancel booking modal, loading skeletons, empty states, logged-in navbar dropdown, toasts.

---

## 6. Routes and access

**Public:** `/`, `/studios`, `/studios/[id]`, `/login`, `/register`, `/how-it-works`, `/about`
**Private (login required):** `/dashboard`, `/add-studio`, `/my-listings`, `/studios/edit/[id]`, `/my-bookings`
**Special:** `not-found.tsx` (custom 404), `loading.tsx` per route group, `error.tsx` for friendly errors.

**Navbar:** sticky glass pill. Logo left. Links: Home, Explore Studios, How It Works, About Us, with an active-route indicator. Theme toggle. Logged out: Login and Register buttons. Logged in: avatar dropdown showing the user's name, with Dashboard, Add New Studio, My Studio Listings, My Bookings, Logout. Hamburger menu on mobile.

**Private route protection:** a `ProtectedRoute` wrapper. While the session is loading, show a skeleton or spinner. Redirect to `/login` ONLY after it is confirmed the user is logged out, and pass the original path so login can return the user there. A logged-in user must never be bounced to login on page reload.

**Owner-only rules:** Edit and My Listings must only allow the owner (match `ownerEmail`). Hide the Book button on a user's own studios.

---

## 7. Mandatory requirement rules (assignment rules, non-negotiable)

1. NO lorem ipsum anywhere. All content is realistic and specific to creative studios.
2. NEVER use `alert()`, `confirm()`, or `prompt()`. Use Sonner toasts and custom modal dialogs for all success, error, and confirmation feedback.
3. Footer social icons use the NEW X logo (react-icons `FaXTwitter` or `RiTwitterXFill`). NEVER the old Twitter bird (and never lucide's `Twitter` icon).
4. Register password rules, shown as inline errors with live indicators, blocking submission if invalid: at least 6 characters, one uppercase letter, one lowercase letter.
5. No email verification and no working forgot-password flow. The "Forgot Password?" link may be shown for the design only.
6. Social login: Google only.
7. Reloading ANY route must not throw an error.
8. Branded skeleton loaders or spinners on route transitions and data fetches.
9. Friendly empty states with a CTA button when searches return nothing, or bookings/listings are empty.
10. Add Studio and Update Studio forms include: Title, Category (Photo Studio, Film Stage, Podcast Lounge, Music Suite, Workshop), Hourly Rate ($), Security Deposit ($), Max Capacity, Location/Address, Image URL (with preview), Amenities (tags/checkboxes), Detailed Overview, and read-only host Name and Email. Success toast, then redirect to `/my-listings`.
11. Delete shows a confirmation modal first, then a success toast.
12. Booking saves with status `Pending`. My Bookings shows status badges (Pending, Confirmed, Completed, Cancelled) and a "Cancel Booking" option on Pending items only.
13. Studio Details has: full specs, gallery carousel/bento gallery, amenities, host details, reviews, and a "Book Workspace Now" button that opens the booking modal.
14. Home has: a hero slider with at least 3 slides (Swiper) with "Explore Studios" and "Host Your Space" buttons, Featured Studios (6 cards, top rated or newest), Browse by Category cards that go to `/studios?category=...`, a "How Booking Works" 4-step section, and a "Host Guarantee and Creator Support" section.
15. Theme toggle (light and dark) changes the entire app.
16. Challenge prep: the booking modal must validate that end time is after start time, and the data layer must include an overlap check function against Confirmed bookings (mock now, real server check later). Show a clear error message on collision.

---

## 8. UI RULES (mandatory on every page)

1. **Headings:** one reusable `SectionHeading` component (eyebrow label plus h2) used for every section on every page. Same font, size, weight, color everywhere. Define heading sizes once in `globals.css`. Never override per page.
2. **Paragraphs:** one body style: `text-base`, `leading-relaxed`, muted color, max width about 65ch, consistent spacing under headings.
3. **Images:** all studio images use `aspect-[4/3]` with `object-cover`. Gallery thumbnails share one fixed ratio. Use `next/image` with proper `sizes`, and configure allowed remote image domains in `next.config`. Always provide meaningful `alt` text. Never stretch images.
4. **Buttons:** ONE reusable `Button` component (primary, secondary, ghost) with identical height, padding, radius, and hover effect everywhere, matching the home page. Never hand-style a button on another page.
5. **Spacing:** one `Section` wrapper (same vertical padding) and one `Container` (same max width and side padding). Use the Tailwind spacing scale only.
6. **Navbar and Footer:** shared components in the root layout, never rebuilt per page. Logo identical in size and style everywhere.
7. **Grids:** CSS grid for all card lists, with equal-size items.
8. **Cards:** all cards in a grid have equal width AND equal height. Use `h-full flex flex-col`, clamp titles with `line-clamp-1` or `line-clamp-2`, and push the price/button row down with `mt-auto`. Applies to studio, category, feature, step, team, and review cards.
9. **Social icons:** new X logo only.
10. **Responsive (mandatory):** must work perfectly at 375px, 768px, 1024px, and 1440px. Mobile first. Grids: 1 column on mobile, 2 on tablet, 3 on desktop. No horizontal scrolling at any width. Tables become cards or scroll inside their own container on mobile. Tap targets at least 44px.

Shared components live in `/components/ui` (Container, Section, SectionHeading, Button, Badge, Card, Modal/ConfirmModal, EmptyState, Skeletons). Every page must use them. If a page looks different from the others, fix it by using the shared components, not by restyling.

---

## 9. Design-to-requirement decisions

- Map the design's studio labels (Soundstage, Daylight Loft, Recording Room, Solarium, etc.) onto the five official categories: **Photo Studio, Film Stage, Podcast Lounge, Music Suite, Workshop**. A small secondary tag may show the original label.
- REMOVE from Explore: the "Map View" toggle and the "Zero-State Test" button. Not required.
- Explore filters that must really work: search (title/location), category (also driven by the `?category=` URL param), price range, sort (Top Rated, Price Low-High, Price High-Low, Newest), and pagination. Date, amenities, and "Instant Book" controls may be visual only unless I ask.
- Keep the filter and page state in the URL query string so refresh and sharing keep the results.
- Studio card: image, category badge, rating, heart icon (visual toggle), title, location, 2-3 short tags, hourly rate, View Details button.
- Dashboard: build from the design using mock data. Include stat cards, recent bookings, and host booking requests with Confirm and Decline actions that update the mock data and show toasts.
- Use realistic dates relative to today, never old fixed dates.
- My Bookings: ticket-style cards matching the design.

---

## 10. Data models (TypeScript types in `/types`; the backend will match these)

**Studio:** `_id`, `title`, `category`, `originalLabel?`, `hourlyRate`, `securityDeposit`, `maxCapacity`, `location`, `images[]`, `amenities[]`, `overview`, `ownerName`, `ownerEmail`, `ownerAvatar`, `rating`, `reviewCount`, `reviews[]`, `createdAt`
**Booking:** `_id`, `studioId`, `studioTitle`, `studioImage`, `userEmail`, `ownerEmail`, `date`, `startTime`, `endTime`, `totalPrice`, `status` (`Pending | Confirmed | Completed | Cancelled`), `createdAt`
**Review:** `userName`, `userAvatar`, `rating`, `comment`, `createdAt`
**User:** `id`, `name`, `email`, `photoURL`, `role` (`user | admin`)

Create 12 realistic studios using the ones in the Explore design, with working image URLs, plus about 6 mock bookings in different statuses, and 2 mock users.

---

## 11. Suggested structure

```
app/
  (public)/ page.tsx, studios/, login/, register/, how-it-works/, about/
  (private)/ dashboard/, add-studio/, my-listings/, studios/edit/[id]/, my-bookings/
  layout.tsx, not-found.tsx, error.tsx, loading.tsx
components/
  ui/ (shadcn + Container, Section, SectionHeading, Button, Badge, Card, ...)
  layout/ (Navbar, Footer, ThemeToggle, UserMenu)
  studios/ (StudioCard, StudioGrid, FilterBar, BookingModal, Gallery, ...)
  shared/ (EmptyState, ConfirmModal, Skeletons, ProtectedRoute)
lib/ api.ts, auth.ts, utils.ts, validators.ts
data/ studios.ts, bookings.ts, users.ts
types/ index.ts
design/ (reference only)
```

---

## 12. Quality checklist (apply to every task before finishing)

- Visually matches the design screenshot at desktop, and is checked at 375, 768, 1024, and 1440px.
- Works in both dark and light themes with good contrast.
- No TypeScript errors, no ESLint errors, no console errors or warnings, no hydration warnings. Run `npm run build` at milestones.
- Keyboard accessible: visible focus states, labeled form fields, `aria-label` on icon-only buttons, semantic HTML, modals trap focus and close on Escape.
- Loading, empty, and error states exist wherever data is fetched.
- Forms validate with clear inline messages and use toasts for results.
- Images are optimized and have alt text. No layout shift from images.
- Subtle, smooth interactions (hover lift, button feedback, modal transitions). Respect `prefers-reduced-motion`.
- No unused code, no leftover test pages, no hardcoded colors, no duplicated components.

---

## 13. How to work

- Do ONE task at a time and exactly what the task says. Do not build extra pages or features.
- Ask before overwriting existing files or installing unlisted libraries.
- Explain briefly what you did at the end of each task, and list the files created or changed.
- Keep each task focused so it becomes one clear git commit. Suggest a commit message in conventional style (for example `feat: add explore page with filters`).
- Keep secrets out of code. Use `.env.local` and make sure `.gitignore` covers it.
- Never invent new visual styles. Reuse the design system and shared components.

---

## 14. Task order (frontend phase)

1. Project setup, theme variables, fonts, Toaster, ThemeProvider, logo assets
2. Shared UI components (Container, Section, SectionHeading, Button, Badge, Card)
3. Navbar and Footer (with logged-in state, mobile menu, theme toggle)
4. Types, mock data, `lib/api.ts`, mock auth and `useAuth`
5. StudioCard, skeletons, EmptyState, ConfirmModal, ProtectedRoute
6. Home
7. Explore (working filters, sort, pagination, URL state, empty state)
8. Studio Details with gallery, host, reviews, and booking modal
9. Login and Register (validation, toasts, mock auth)
10. How It Works, About Us, 404, error page
11. Add Studio and Update Studio
12. My Listings with delete modal
13. My Bookings with cancel flow
14. Dashboard
15. Theme and responsive audit, accessibility audit, UI RULES audit, `npm run build` check

---

## 15. Final deliverables (reminder for later phases)

- At least 15 meaningful commits on the client and 8 on the server.
- README with site name, live URL, at least 5 feature bullets, tech stack, local setup steps, and examiner test credentials.
- Deploy early (Vercel for client, Vercel for server). Test auth, CRUD, bookings, and page reloads on the live site.
- Submit: client repo link, server repo link, live site link.
- Challenges: JWT in HTTPOnly cookies (401 on unauthorized), double-booking prevention (reject overlaps with Confirmed bookings), dark/light theme toggle.
- Optional: PDF booking invoice, saved studios wishlist.