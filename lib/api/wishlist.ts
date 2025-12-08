import { apiFetch } from "./client";
import { getTokens } from "../auth/tokenStorage";

function getAuthHeaders(): HeadersInit {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Not authenticated");
  }
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing?: {
    id: string;
    title: string;
    city: string;
    country: string;
    category: string;
    tourFee: number;
    avgRating: number;
    images?: Array<{ url: string }>;
  };
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const wishlistApi = {
  getWishlist: async (page = 1, limit = 20): Promise<WishlistResponse> => {
    return apiFetch(`/wishlist?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  addToWishlist: async (listingId: string): Promise<{ success: boolean; data: WishlistItem }> => {
    return apiFetch("/wishlist", {
      method: "POST",
      headers: getAuthHeaders(),
      body: { listingId },
      withCredentials: true,
    });
  },

  removeFromWishlist: async (listingId: string): Promise<{ success: boolean }> => {
    return apiFetch(`/wishlist/${listingId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  checkWishlistStatus: async (listingId: string): Promise<{ success: boolean; data: { isInWishlist: boolean } }> => {
    return apiFetch(`/wishlist/check/${listingId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },
};

