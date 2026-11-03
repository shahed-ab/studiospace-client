import {
  Studio,
  Booking,
  StudioFilterParams,
  BookingStatus,
} from "@/types";
import { http } from "@/lib/http";

// Parse "HH:mm" into minutes since midnight
function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
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
  const query = new URLSearchParams();

  if (params?.query) query.set("search", params.query);
  if (params?.category && params.category !== "All" && params.category !== "All Disciplines") {
    query.set("category", params.category);
  }
  if (params?.minPrice !== undefined && params.minPrice > 0) {
    query.set("minPrice", String(params.minPrice));
  }
  if (params?.maxPrice !== undefined && params.maxPrice < 99999) {
    query.set("maxPrice", String(params.maxPrice));
  }

  const sortMap: Record<string, string> = {
    "top-rated": "top",
    "price-asc": "price-asc",
    "price-desc": "price-desc",
    newest: "newest",
  };
  if (params?.sortBy) {
    query.set("sort", sortMap[params.sortBy] || "newest");
  }

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const queryString = query.toString();
  const endpoint = `/server-api/studios${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await http<{
      studios: Studio[];
      total: number;
      page: number;
      pages: number;
    }>(endpoint);

    return {
      studios: res.studios || [],
      total: res.total || 0,
      totalPages: res.pages || 1,
      currentPage: res.page || 1,
    };
  } catch (error) {
    console.error("Failed to fetch studios:", error);
    return {
      studios: [],
      total: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }
}

export async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    const res = await http<{ studios: Studio[] }>("/server-api/studios?sort=top&limit=6");
    return res.studios || [];
  } catch (error) {
    console.error("Failed to fetch featured studios:", error);
    return [];
  }
}

export async function getCategoryStats(): Promise<{ category: string; count: number }[]> {
  try {
    return await http.get<{ category: string; count: number }[]>(
      "/server-api/studios/stats/categories"
    );
  } catch (error) {
    console.error("Failed to fetch category stats:", error);
    return [];
  }
}

export async function getStudioById(id: string): Promise<Studio | null> {
  try {
    return await http.get<Studio>(`/server-api/studios/${id}`);
  } catch (error) {
    console.error(`Failed to fetch studio ${id}:`, error);
    return null;
  }
}

export async function getMyStudios(_userEmail?: string): Promise<Studio[]> {
  try {
    return await http.get<Studio[]>("/server-api/my-studios");
  } catch (error) {
    console.error("Failed to fetch host studios:", error);
    return [];
  }
}

export async function createStudio(
  studioData: Omit<Studio, "_id" | "createdAt" | "rating" | "reviewCount" | "reviews">
): Promise<Studio> {
  return http.post<Studio>("/server-api/studios", studioData);
}

export async function updateStudio(
  id: string,
  updates: Partial<Studio>
): Promise<Studio> {
  return http.put<Studio>(`/server-api/studios/${id}`, updates);
}

export async function deleteStudio(id: string): Promise<{ success: boolean }> {
  await http.delete(`/server-api/studios/${id}`);
  return { success: true };
}

// ==========================================
// BOOKING APIS & AVAILABILITY
// ==========================================

export async function getStudioAvailability(
  studioId: string,
  date: string
): Promise<Booking[]> {
  try {
    return await http.get<Booking[]>(
      `/server-api/studios/${studioId}/availability?date=${date}`
    );
  } catch {
    return [];
  }
}

export async function checkBookingOverlap(
  studioId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<{ hasOverlap: boolean; conflictingBooking?: Booking }> {
  try {
    const confirmed = await getStudioAvailability(studioId, date);
    const reqStart = timeToMinutes(startTime);
    const reqEnd = timeToMinutes(endTime);

    const conflict = confirmed.find((b) => {
      if (excludeBookingId && b._id === excludeBookingId) return false;
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return reqStart < bEnd && reqEnd > bStart;
    });

    return {
      hasOverlap: Boolean(conflict),
      conflictingBooking: conflict,
    };
  } catch {
    return { hasOverlap: false };
  }
}

export async function createBooking(
  bookingData: Omit<Booking, "_id" | "createdAt" | "status">
): Promise<Booking> {
  const reqStart = timeToMinutes(bookingData.startTime);
  const reqEnd = timeToMinutes(bookingData.endTime);
  if (reqEnd <= reqStart) {
    throw new Error("End time must be after start time");
  }

  return http.post<Booking>("/server-api/bookings", {
    studioId: bookingData.studioId,
    date: bookingData.date,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    specialRequests: bookingData.specialRequests,
  });
}

export async function getMyBookings(_userEmail?: string): Promise<Booking[]> {
  try {
    return await http.get<Booking[]>("/server-api/bookings/my");
  } catch (error) {
    console.error("Failed to fetch my bookings:", error);
    return [];
  }
}

export async function getHostBookings(_ownerEmail?: string): Promise<Booking[]> {
  try {
    return await http.get<Booking[]>("/server-api/bookings/host");
  } catch (error) {
    console.error("Failed to fetch host bookings:", error);
    return [];
  }
}

export async function cancelBooking(id: string): Promise<{ success: boolean; booking?: Booking }> {
  const booking = await http.patch<Booking>(`/server-api/bookings/${id}/cancel`, {});
  return { success: true, booking };
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  return http.patch<Booking>(`/server-api/bookings/${id}/status`, { status });
}

// ==========================================
// DASHBOARD APIS
// ==========================================

export interface DashboardStats {
  listingsCount: number;
  myBookingsCount: number;
  pendingRequestsCount: number;
  earnings: number;
  totalEarnings?: number;
  listings?: number;
  bookings?: number;
  pendingRequests?: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return http.get<DashboardStats>("/server-api/dashboard/stats");
}

// ==========================================
// WISHLIST APIS
// ==========================================

export async function getWishlist(): Promise<Studio[]> {
  try {
    const items = await http.get<any[]>("/server-api/wishlist");
    return items
      .map((item) => (item.studioId && typeof item.studioId === "object" ? item.studioId : null))
      .filter(Boolean) as Studio[];
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return [];
  }
}

export async function addToWishlist(studioId: string): Promise<any> {
  return http.post(`/server-api/wishlist/${studioId}`, {});
}

export async function removeFromWishlist(studioId: string): Promise<any> {
  return http.delete(`/server-api/wishlist/${studioId}`);
}
