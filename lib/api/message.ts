import { apiFetch } from "./client";

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
  createMessage: async (bookingId: string, payload: CreateMessagePayload): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/api/v1/bookings/${bookingId}/messages`, {
      method: "POST",
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
      `/api/v1/bookings/${bookingId}/messages${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        withCredentials: true,
      }
    );
  },

  markMessagesAsRead: async (bookingId: string): Promise<void> => {
    await apiFetch(`/api/v1/bookings/${bookingId}/messages/read`, {
      method: "PATCH",
      withCredentials: true,
    });
  },
};

