import { apiFetch } from "./client";

export interface AvailabilitySlot {
  id: string;
  guideId: string;
  date: string | null;
  dayOfWeek: number | null;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilitySlotPayload {
  date?: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
}

export interface UpdateAvailabilitySlotPayload {
  date?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isRecurring?: boolean;
  isActive?: boolean;
}

export interface AvailabilitySlotsResponse {
  success: boolean;
  message: string;
  data: {
    slots: AvailabilitySlot[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface AvailabilitySlotResponse {
  success: boolean;
  message: string;
  data: {
    slot: AvailabilitySlot;
  };
}

export interface CheckAvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    available: boolean;
    slots: AvailabilitySlot[];
  };
}

export const availabilityApi = {
  createSlot: async (
    payload: CreateAvailabilitySlotPayload
  ): Promise<AvailabilitySlotResponse> => {
    return apiFetch<AvailabilitySlotResponse>("/availability", {
      method: "POST",
      body: payload,
      withCredentials: true,
    });
  },

  getSlots: async (params?: {
    guideId?: string;
    date?: string;
    dayOfWeek?: number;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<AvailabilitySlotsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.guideId) queryParams.append("guideId", params.guideId);
    if (params?.date) queryParams.append("date", params.date);
    if (params?.dayOfWeek !== undefined)
      queryParams.append("dayOfWeek", String(params.dayOfWeek));
    if (params?.isActive !== undefined)
      queryParams.append("isActive", String(params.isActive));
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    const queryString = queryParams.toString();
    return apiFetch<AvailabilitySlotsResponse>(
      `/availability${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
      }
    );
  },

  checkAvailability: async (
    guideId: string,
    date: string
  ): Promise<CheckAvailabilityResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("guideId", guideId);
    queryParams.append("date", date);

    return apiFetch<CheckAvailabilityResponse>(
      `/availability/check?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
  },

  updateSlot: async (
    id: string,
    payload: UpdateAvailabilitySlotPayload
  ): Promise<AvailabilitySlotResponse> => {
    return apiFetch<AvailabilitySlotResponse>(`/availability/${id}`, {
      method: "PATCH",
      body: payload,
      withCredentials: true,
    });
  },

  deleteSlot: async (id: string): Promise<void> => {
    await apiFetch(`/availability/${id}`, {
      method: "DELETE",
      withCredentials: true,
    });
  },
};
