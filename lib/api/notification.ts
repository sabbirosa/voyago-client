import { apiFetch } from "./client";

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
    if (params?.read !== undefined) queryParams.append("read", String(params.read));

    const queryString = queryParams.toString();
    return apiFetch<NotificationsResponse>(
      `/api/v1/notifications${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        withCredentials: true,
      }
    );
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return apiFetch<UnreadCountResponse>("/api/v1/notifications/unread-count", {
      method: "GET",
      withCredentials: true,
    });
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiFetch(`/api/v1/notifications/${id}/read`, {
      method: "PATCH",
      withCredentials: true,
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiFetch("/api/v1/notifications/read-all", {
      method: "PATCH",
      withCredentials: true,
    });
  },
};


