import {
  Studio,
  Booking,
  StudioFilterParams,
  BookingStatus,
} from "@/types";
import { initialStudios } from "@/data/studios";
import { initialBookings } from "@/data/bookings";

// Simulated network delay between min and max ms
function delay(min = 400, max = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory / localStorage cache for studios
const STUDIOS_STORAGE_KEY = "studiospace_studios";
const BOOKINGS_STORAGE_KEY = "studiospace_bookings";

function getStoredStudios(): Studio[] {
  if (typeof window === "undefined") {
    return initialStudios;
  }
  try {
    const raw = localStorage.getItem(STUDIOS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(initialStudios));
      return initialStudios;
    }
    return JSON.parse(raw);
  } catch {
    return initialStudios;
  }
}

function saveStudios(studios: Studio[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(studios));
    } catch (e) {
      console.error("Failed to save studios to localStorage", e);
    }
  }
}

function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") {
    return initialBookings;
  }
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return JSON.parse(raw);
  } catch {
    return initialBookings;
  }
}

function saveBookings(bookings: Booking[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings to localStorage", e);
    }
  }
}

// ==========================================
// STUDIO APIS
// ==========================================

export async function getStudios(params?: StudioFilterParams): Promise<{
  studios: Studio[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  await delay(400, 700);
  let list = [...getStoredStudios()];

  if (params?.query) {
    const q = params.query.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        (s.city && s.city.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  if (params?.category && params.category !== "All" && params.category !== "All Disciplines") {
    list = list.filter((s) => s.category.toLowerCase() === params.category!.toLowerCase());
  }

  if (params?.minPrice !== undefined) {
    list = list.filter((s) => s.hourlyRate >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    list = list.filter((s) => s.hourlyRate <= params.maxPrice!);
  }

  if (params?.sortBy) {
    switch (params.sortBy) {
      case "price-asc":
        list.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-desc":
        list.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "top-rated":
      default:
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
    }
  }

  const total = list.length;
  const page = params?.page || 1;
  const limit = params?.limit || 9;
  const totalPages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;
  const paginated = list.slice(offset, offset + limit);

  return {
    studios: paginated,
    total,
    totalPages,
    currentPage: page,
  };
}

export async function getFeaturedStudios(): Promise<Studio[]> {
  await delay(400, 600);
  const list = getStoredStudios();
  // Return 6 top-rated studios matching the home page design
  return list.filter((s) => s.featured).slice(0, 6);
}

export async function getStudioById(id: string): Promise<Studio | null> {
  await delay(400, 700);
  const list = getStoredStudios();
  return list.find((s) => s._id === id) || null;
}

export async function getMyStudios(userEmail: string): Promise<Studio[]> {
  await delay(400, 700);
  const list = getStoredStudios();
  return list.filter((s) => s.ownerEmail.toLowerCase() === userEmail.toLowerCase());
}

export async function createStudio(
  studioData: Omit<Studio, "_id" | "createdAt" | "rating" | "reviewCount" | "reviews">
): Promise<Studio> {
  await delay(600, 900);
  const list = getStoredStudios();
  const newStudio: Studio = {
    ...studioData,
    _id: `std_${Date.now()}`,
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
  };

  const updated = [newStudio, ...list];
  saveStudios(updated);
  return newStudio;
}

export async function updateStudio(
  id: string,
  updates: Partial<Studio>
): Promise<Studio> {
  await delay(600, 900);
  const list = getStoredStudios();
  const index = list.findIndex((s) => s._id === id);
  if (index === -1) {
    throw new Error("Studio not found");
  }

  const updatedStudio = { ...list[index], ...updates };
  list[index] = updatedStudio;
  saveStudios(list);
  return updatedStudio;
}

export async function deleteStudio(id: string): Promise<{ success: boolean }> {
  await delay(500, 800);
  const list = getStoredStudios();
  const filtered = list.filter((s) => s._id !== id);
  saveStudios(filtered);
  return { success: true };
}

// ==========================================
// BOOKING APIS & OVERLAP VALIDATION
// ==========================================

// Parse "HH:mm" into minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

export async function checkBookingOverlap(
  studioId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<{ hasOverlap: boolean; conflictingBooking?: Booking }> {
  await delay(200, 400);
  const bookings = getStoredBookings();
  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);

  const conflict = bookings.find((b) => {
    if (b.studioId !== studioId) return false;
    if (b.date !== date) return false;
    if (b.status !== "Confirmed" && b.status !== "Pending") return false;
    if (excludeBookingId && b._id === excludeBookingId) return false;

    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    // Overlap condition: start < other.end && end > other.start
    return reqStart < bEnd && reqEnd > bStart;
  });

  return {
    hasOverlap: Boolean(conflict),
    conflictingBooking: conflict,
  };
}

export async function createBooking(
  bookingData: Omit<Booking, "_id" | "createdAt" | "status">
): Promise<Booking> {
  await delay(600, 900);

  // Validate start time < end time
  const reqStart = timeToMinutes(bookingData.startTime);
  const reqEnd = timeToMinutes(bookingData.endTime);
  if (reqEnd <= reqStart) {
    throw new Error("End time must be after start time");
  }

  // Check overlap against Confirmed bookings
  const { hasOverlap, conflictingBooking } = await checkBookingOverlap(
    bookingData.studioId,
    bookingData.date,
    bookingData.startTime,
    bookingData.endTime
  );

  if (hasOverlap && conflictingBooking) {
    throw new Error(
      `Slot unavailable: Another reservation exists for this studio on ${conflictingBooking.date} from ${conflictingBooking.startTime} to ${conflictingBooking.endTime}.`
    );
  }

  const list = getStoredBookings();
  const newBooking: Booking = {
    ...bookingData,
    _id: `bk_${Date.now()}`,
    status: "Pending", // Section 7 Rule 12: saves with status Pending
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...list];
  saveBookings(updated);
  return newBooking;
}

export async function getMyBookings(userEmail: string): Promise<Booking[]> {
  await delay(400, 700);
  const list = getStoredBookings();
  return list.filter((b) => b.userEmail.toLowerCase() === userEmail.toLowerCase());
}

export async function getHostBookings(ownerEmail: string): Promise<Booking[]> {
  await delay(400, 700);
  const list = getStoredBookings();
  return list.filter((b) => b.ownerEmail.toLowerCase() === ownerEmail.toLowerCase());
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  await delay(400, 700);
  const list = getStoredBookings();
  const index = list.findIndex((b) => b._id === id);
  if (index === -1) {
    throw new Error("Booking not found");
  }

  list[index].status = status;
  saveBookings(list);
  return list[index];
}

export async function cancelBooking(id: string): Promise<{ success: boolean }> {
  await delay(500, 800);
  const list = getStoredBookings();
  const index = list.findIndex((b) => b._id === id);
  if (index === -1) {
    throw new Error("Booking not found");
  }

  // Only allow cancelling if pending
  if (list[index].status !== "Pending") {
    throw new Error("Only pending bookings can be cancelled.");
  }

  list[index].status = "Cancelled";
  saveBookings(list);
  return { success: true };
}

