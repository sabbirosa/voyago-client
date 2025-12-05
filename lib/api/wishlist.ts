import { apiFetch } from "./client";

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
    return apiFetch(`/wishlist?page=${page}&limit=${limit}`);
  },

  addToWishlist: async (listingId: string): Promise<{ success: boolean; data: WishlistItem }> => {
    return apiFetch("/wishlist", {
      method: "POST",
      body: JSON.stringify({ listingId }),
    });
  },

  removeFromWishlist: async (listingId: string): Promise<{ success: boolean }> => {
    return apiFetch(`/wishlist/${listingId}`, {
      method: "DELETE",
    });
  },

  checkWishlistStatus: async (listingId: string): Promise<{ success: boolean; data: { isInWishlist: boolean } }> => {
    return apiFetch(`/wishlist/check/${listingId}`);
  },
};

