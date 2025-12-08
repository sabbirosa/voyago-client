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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  isApproved: boolean;
  isBanned: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: any;
  guideProfile?: any;
}

export interface AdminListing {
  id: string;
  guideId: string;
  title: string;
  description: string;
  city: string;
  country: string;
  category: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "BLOCKED";
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  guide?: {
    id: string;
    name: string;
    email: string;
  };
  images?: Array<{ url: string }>;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalGuides: number;
  totalTourists: number;
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  platformFees: number;
  bookingsByStatus: Record<string, number>;
  bookingsByMonth: Array<{ month: string; count: number; revenue: number }>;
  topCities: Array<{ city: string; country: string; count: number }>;
  topGuides: Array<{
    guideId: string;
    guideName: string;
    bookings: number;
    revenue: number;
  }>;
  popularCategories: Array<{ category: string; count: number }>;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface ListingsResponse {
  success: boolean;
  message: string;
  data: {
    listings: AdminListing[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    analytics: AdminAnalytics;
  };
}

export const adminApi = {
  getUsers: async (params?: {
    role?: string;
    isBanned?: boolean;
    isApproved?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append("role", params.role);
    if (params?.isBanned !== undefined)
      queryParams.append("isBanned", String(params.isBanned));
    if (params?.isApproved !== undefined)
      queryParams.append("isApproved", String(params.isApproved));
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiFetch<UsersResponse>(
      `/admin/users${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
  },

  updateUser: async (
    id: string,
    payload: {
      isBanned?: boolean;
      isApproved?: boolean;
      role?: "TOURIST" | "GUIDE" | "ADMIN";
    }
  ): Promise<{ success: boolean; data: { user: AdminUser } }> => {
    return apiFetch(`/admin/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: payload,
      withCredentials: true,
    });
  },

  getListings: async (params?: {
    status?: string;
    guideId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ListingsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.guideId) queryParams.append("guideId", params.guideId);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiFetch<ListingsResponse>(
      `/admin/listings${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
  },

  updateListing: async (
    id: string,
    payload: { status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "BLOCKED" }
  ): Promise<{ success: boolean; data: { listing: AdminListing } }> => {
    return apiFetch(`/admin/listings/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: payload,
      withCredentials: true,
    });
  },

  getAnalytics: async (): Promise<AnalyticsResponse> => {
    return apiFetch<AnalyticsResponse>("/admin/analytics", {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  getBookings: async (params?: {
    status?: string;
    touristId?: string;
    guideId?: string;
    listingId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: { bookings: any[] };
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.touristId) queryParams.append("touristId", params.touristId);
    if (params?.guideId) queryParams.append("guideId", params.guideId);
    if (params?.listingId) queryParams.append("listingId", params.listingId);
    if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) queryParams.append("dateTo", params.dateTo);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.sort) queryParams.append("sort", params.sort);

    const queryString = queryParams.toString();
    return apiFetch(
      `/admin/bookings${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
  },
};
