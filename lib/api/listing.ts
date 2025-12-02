"use client";

import { apiFetch } from "./client";
import { getTokens } from "../auth/tokenStorage";

export type ListingStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "BLOCKED";
export type ListingCategory =
  | "FOOD"
  | "ART"
  | "ADVENTURE"
  | "CULTURE"
  | "PHOTOGRAPHY"
  | "NIGHTLIFE"
  | "NATURE"
  | "ARCHITECTURE"
  | "SHOPPING"
  | "FAMILY"
  | "SPORTS"
  | "HISTORY";

export type FeeType = "PER_PERSON" | "PER_GROUP";

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  order: number;
  createdAt: string;
}

export interface Listing {
  id: string;
  guideId: string;
  title: string;
  description: string;
  itinerary: string | null;
  city: string;
  country: string;
  category: ListingCategory;
  languages: string[];
  tourFee: number;
  feeType: FeeType;
  duration: number;
  meetingPoint: string | null;
  meetingLat: number | null;
  meetingLng: number | null;
  maxGroupSize: number;
  status: ListingStatus;
  avgRating: number;
  totalReviews: number;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  itinerary?: string;
  city: string;
  country: string;
  category: ListingCategory;
  languages: string[];
  tourFee: number;
  feeType: FeeType;
  duration: number;
  meetingPoint?: string;
  meetingLat?: number;
  meetingLng?: number;
  maxGroupSize: number;
  status?: ListingStatus;
  images?: string[];
}

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  itinerary?: string;
  city?: string;
  country?: string;
  category?: ListingCategory;
  languages?: string[];
  tourFee?: number;
  feeType?: FeeType;
  duration?: number;
  meetingPoint?: string;
  meetingLat?: number;
  meetingLng?: number;
  maxGroupSize?: number;
  status?: ListingStatus;
  images?: string[];
}

export interface GetListingsQuery {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  country?: string;
  category?: ListingCategory;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  status?: ListingStatus;
  guideId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedListingsResponse {
  success: boolean;
  data: { listings: Listing[] };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

function getAuthHeaders(): HeadersInit {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Not authenticated");
  }
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

export async function getListings(
  query?: GetListingsQuery
): Promise<PaginatedListingsResponse> {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const path = queryString ? `/listings?${queryString}` : "/listings";

  return apiFetch<PaginatedListingsResponse>(path, {
    method: "GET",
  });
}

export async function getListingById(listingId: string): Promise<Listing> {
  const response = await apiFetch<{
    success: boolean;
    data: { listing: Listing };
  }>(`/listings/${listingId}`, {
    method: "GET",
  });
  return response.data.listing;
}

export async function createListing(
  payload: CreateListingPayload
): Promise<Listing> {
  const response = await apiFetch<{
    success: boolean;
    data: { listing: Listing };
  }>("/listings", {
    method: "POST",
    headers: getAuthHeaders(),
    body: payload,
  });
  return response.data.listing;
}

export async function updateListing(
  listingId: string,
  payload: UpdateListingPayload
): Promise<Listing> {
  const response = await apiFetch<{
    success: boolean;
    data: { listing: Listing };
  }>(`/listings/${listingId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: payload,
  });
  return response.data.listing;
}

export async function deleteListing(listingId: string): Promise<void> {
  await apiFetch(`/listings/${listingId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

