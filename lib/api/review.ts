import { apiFetch } from "./client";

export interface Review {
  id: string;
  bookingId: string;
  listingId: string;
  touristId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  tourist?: {
    id: string;
    name: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
  listing?: {
    id: string;
    title: string;
  };
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: Review[];
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: Review;
  };
}

export const reviewApi = {
  createReview: async (payload: CreateReviewPayload): Promise<ReviewResponse> => {
    return apiFetch<ReviewResponse>("/api/v1/reviews", {
      method: "POST",
      body: payload,
      withCredentials: true,
    });
  },

  getReviewsByListing: async (
    listingId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    const queryString = queryParams.toString();
    return apiFetch<ReviewsResponse>(
      `/api/v1/reviews/listings/${listingId}${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
      }
    );
  },
};

