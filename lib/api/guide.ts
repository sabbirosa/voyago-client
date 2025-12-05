import { apiFetch } from "./client";

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

export const guideApi = {
  getAnalytics: async (): Promise<{ success: boolean; data: GuideAnalytics }> => {
    return apiFetch("/guide/analytics");
  },

  getBadges: async (): Promise<{ success: boolean; data: GuideBadge[] }> => {
    return apiFetch("/guide/badges");
  },
};

