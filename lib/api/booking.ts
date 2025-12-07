import { apiFetch } from "./client";

export interface Booking {
  id: string;
  listingId: string;
  touristId: string;
  guideId: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  platformFee: number;
  note: string | null;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "DECLINED"
    | "PAID"
    | "COMPLETED"
    | "CANCELLED";
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  listing?: {
    id: string;
    title: string;
    city: string;
    country: string;
    images: Array<{ url: string; order: number }>;
  };
  tourist?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
  guide?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paidAt: string | null;
  };
  review?: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
  };
}

export interface CreateBookingPayload {
  listingId: string;
  date: string;
  groupSize: number;
  note?: string;
}

export interface UpdateBookingStatusPayload {
  status: "ACCEPTED" | "DECLINED" | "CANCELLED";
  reason?: string;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: Booking[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: Booking;
  };
}

export const bookingApi = {
  createBooking: async (
    payload: CreateBookingPayload
  ): Promise<BookingResponse> => {
    return apiFetch<BookingResponse>("/bookings", {
      method: "POST",
      body: payload,
      withCredentials: true,
    });
  },

  getBookings: async (params?: {
    status?: string;
    upcoming?: boolean;
    past?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<BookingsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.upcoming !== undefined)
      queryParams.append("upcoming", String(params.upcoming));
    if (params?.past !== undefined)
      queryParams.append("past", String(params.past));
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.sort) queryParams.append("sort", params.sort);

    const queryString = queryParams.toString();
    return apiFetch<BookingsResponse>(
      `/bookings/me${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        withCredentials: true,
      }
    );
  },

  getBookingById: async (id: string): Promise<BookingResponse> => {
    return apiFetch<BookingResponse>(`/bookings/${id}`, {
      method: "GET",
      withCredentials: true,
    });
  },

  updateBookingStatus: async (
    id: string,
    payload: UpdateBookingStatusPayload
  ): Promise<BookingResponse> => {
    return apiFetch<BookingResponse>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: payload,
      withCredentials: true,
    });
  },
};
