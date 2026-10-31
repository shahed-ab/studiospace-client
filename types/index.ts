export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop";

export interface Review {
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  originalLabel?: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  address?: string;
  city?: string;
  images: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  createdAt: string;
  tags?: string[];
  featured?: boolean;
  instantBook?: boolean;
  squareFeet?: number;
  ceilingHeight?: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  userEmail: string;
  userName?: string;
  ownerEmail: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "09:00")
  endTime: string; // HH:mm (e.g. "13:00")
  totalHours?: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  specialRequests?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: "user" | "admin";
}

export interface StudioFilterParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "top-rated" | "price-asc" | "price-desc" | "newest";
  page?: number;
  limit?: number;
}

