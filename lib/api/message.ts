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

export interface Message {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  fromUser?: {
    id: string;
    name: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
  toUser?: {
    id: string;
    name: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
}

export interface CreateMessagePayload {
  bookingId: string;
  body: string;
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  data: {
    messages: Message[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data: {
    message: Message;
  };
}

export const messageApi = {
  createMessage: async (
    bookingId: string,
    payload: CreateMessagePayload
  ): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/bookings/${bookingId}/messages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: payload,
      withCredentials: true,
    });
  },

  getMessagesByBooking: async (
    bookingId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<MessagesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    const queryString = queryParams.toString();
    return apiFetch<MessagesResponse>(
      `/bookings/${bookingId}/messages${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
  },

  markMessagesAsRead: async (bookingId: string): Promise<void> => {
    await apiFetch(`/bookings/${bookingId}/messages/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },
};
