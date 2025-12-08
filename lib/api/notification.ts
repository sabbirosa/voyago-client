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

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  dataJson: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export const notificationApi = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    read?: boolean;
  }): Promise<NotificationsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.read !== undefined)
      queryParams.append("read", String(params.read));

    const queryString = queryParams.toString();
    return apiFetch<NotificationsResponse>(
      `/notifications${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return apiFetch<UnreadCountResponse>("/notifications/unread-count", {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiFetch(`/notifications/${id}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiFetch("/notifications/read-all", {
      method: "PATCH",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },
};
