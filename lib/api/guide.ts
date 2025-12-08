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

export interface GuideAnalytics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  upcomingBookings: number;
  completedBookings: number;
  pendingBookings: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface GuideBadge {
  id: string;
  badgeType: string;
  earnedAt: string;
}

export interface PublicGuideProfile {
  id: string;
  name: string;
  profile?: {
    id: string;
    bio?: string;
    avatarUrl?: string;
    languages?: string[];
    city?: string;
    country?: string;
  };
  guideProfile?: {
    id: string;
    expertise: string[];
    dailyRate?: number;
    experienceYears?: number;
    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  };
  listings: Array<{
    id: string;
    title: string;
    city: string;
    country: string;
    category: string;
    tourFee: number;
    feeType: string;
    duration: number;
    avgRating: number;
    totalReviews: number;
    image: string | null;
  }>;
  stats: {
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    totalListings: number;
  };
}

export const guideApi = {
  getAnalytics: async (): Promise<{ success: boolean; data: GuideAnalytics }> => {
    return apiFetch("/guide/analytics", {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  getBadges: async (): Promise<{ success: boolean; data: GuideBadge[] }> => {
    return apiFetch("/guide/badges", {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  getPublicProfile: async (
    guideId: string
  ): Promise<{ success: boolean; message: string; data: { guide: PublicGuideProfile } }> => {
    return apiFetch(`/guide/${guideId}`, {
      method: "GET",
    });
  },

  getGuides: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: { guides: PublicGuideProfile[] };
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiFetch(`/guide${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },
};

